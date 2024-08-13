import Form from '@/app/ui/passwords/edit-form';
import Breadcrumbs from '@/app/ui/passwords/breadcrumbs';
import { fetchPasswordById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [password] = await Promise.all([
        fetchPasswordById(id),
    ]);

    if (!password) {
        notFound();
    }
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Passwords', href: '/dashboard/passwords' },
                    {
                        label: 'Edit Password',
                        href: `/dashboard/passwords/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form password={password} />
        </main>
    );
}