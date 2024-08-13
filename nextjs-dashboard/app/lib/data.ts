import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  PasswordForm,
  PasswordsTable,
  LatestPasswordRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
//import speedTest, { SpeedTestResult } from 'speedtest-net';

/*const testInternetUploadSpeed = async () => {
  try {
    const test = speedTest({ acceptLicense: true });

    test.on('data', (result: SpeedTestResult) => {
      const uploadSpeed = result.upload.bandwidth / 125000; // Convert from bytes/sec to Mbps
      console.log(`Upload Speed: ${uploadSpeed.toFixed(2)} Mbps`);
    });

    test.on('error', (error) => {
      console.error('Error during speed test:', error.message);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

const testInternetDownloadSpeed = async () => {
  try {
    const test = speedTest({ acceptLicense: true });

    test.on('data', (result: SpeedTestResult) => {
      const downloadSpeed = result.download.bandwidth / 125000; // Convert from bytes/sec to Mbps
      console.log(`Download Speed: ${downloadSpeed.toFixed(2)} Mbps`);
    });

    test.on('error', (error) => {
      console.error('Error during speed test:', error.message);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};*/

export async function fetchCardData() {
  try{

    const data = await Promise.all([
      HouseBatteryPercentage = 0,
      InternetDownloadSpeed = 0,
      InternetUploadSpeed = 0,
      WifiPassword = "Corkill123!",
    ]);

    var HouseBatteryPercentage = Number(data[0]);
    var InternetDownloadSpeed = Number(data[1]);
    var InternetUploadSpeed = Number(data[2]);
    var WifiPassword = String(data[3]);

    return {
      HouseBatteryPercentage,
      InternetDownloadSpeed,
      InternetUploadSpeed,
      WifiPassword,
    };
  } catch(error) {
    console.log(error)
  }
};

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredPasswords(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const passwords = await sql<PasswordsTable>`
      SELECT
        passwords.id,
        passwords.service,
        passwords.email,
        passwords.password
      FROM passwords
      WHERE
        passwords.service ILIKE ${`%${query}%`} OR
        passwords.email ILIKE ${`%${query}%`} OR
        passwords.password::text ILIKE ${`%${query}%`} OR
        passwords.id::text ILIKE ${`%${query}%`}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return passwords.rows;
  } catch (error) {
    console.error('Database Error:', error);
    if (typeof window !== "undefined") {
      // Fallback: Attempt client-side fetching
      try {
        const response = await fetch(`/api/passwords?query=${query}&page=${currentPage}`);
        if (!response.ok) throw new Error("Failed to fetch passwords on the client.");
        const data = await response.json();
        return data;
      } catch (clientError) {
        console.error('Client-side Fetch Error:', clientError);
        throw new Error('Failed to fetch passwords.');
      }
    } else {
      throw new Error('Failed to fetch passwords.');
    }
  }
}


export async function fetchPasswordsPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM passwords
    WHERE
      passwords.service::text ILIKE ${`%${query}%`} OR
      passwords.email::text ILIKE ${`%${query}%`} OR
      passwords.id::text ILIKE ${`%${query}%`} OR
      passwords.password ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of passwords.');
  }
}

export async function fetchPasswordById(id: string) {
  try {
    const result = await sql`
      SELECT id, service, email, password
      FROM passwords
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      console.warn(`No password found with ID: ${id}`);
      throw new Error('Password not found.');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Database Error:', error.message); // Improved logging
    throw new Error('Failed to fetch password.'); // Keep user-facing message generic
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(passwords.id) AS total_passwords,
		FROM customers
		LEFT JOIN passwords ON customers.id = passwords.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchNotices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT notices.content
      FROM notices
      ORDER BY notices.date DESC
      LIMIT 5`;

    const LatestNotice = data.rows.map((invoice) => ({
      ...invoice
    }));
    return LatestNotice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}