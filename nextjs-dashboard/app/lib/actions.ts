'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  service: z.string(),
  email: z.string(),
  password: z.string(),
});

export type State = {
  errors?: {
    id?: string[];
    service?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const UpdatePassword = FormSchema.omit({ id: true, date: true });
const CreatePassword = FormSchema.omit({ id: true, date: true });

export async function createPassword(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreatePassword.safeParse({
    service: formData.get('service'),
    email: formData.get('email'),
    password: formData.get('password')
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Password.',
    };
  }

  // Prepare data for insertion into the database
  const { email, password, service } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
        INSERT INTO passwords (service, email, password)
        VALUES (${service}, ${email}, ${password})
      `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Password.',
    };
  }

  // Revalidate the cache for the passwords page and redirect the user.
  revalidatePath('/dashboard/passwords');
  redirect('/dashboard/passwords');
}

export async function updatePassword(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdatePassword.safeParse({
    service: formData.get('service'),
    email: formData.get('email'),
    password: formData.get('password')
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Password.',
    };
  }
 
  var { service, email, password } = validatedFields.data;
 
  try {
    await sql`
    UPDATE passwords
    SET service = ${service}, email = ${email}, password = ${password}
    WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Password.' };
  }
 
  revalidatePath('/dashboard/passwords');
  redirect('/dashboard/passwords');
}

export async function deletePassword(id: string) {
  try {
    await sql`DELETE FROM passwords WHERE id = ${id}`;
    revalidatePath('/dashboard/passwords');
    return { message: 'Deleted Password.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Password.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}