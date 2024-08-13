import Form from '@/app/ui/passwords/create-form';
import Breadcrumbs from '@/app/ui/passwords/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Passwords', href: '/dashboard/passwords' },
          {
            label: 'Create Password',
            href: '/dashboard/passwords/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}