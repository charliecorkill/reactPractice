'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  KeyIcon,
  AtSymbolIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPassword, State } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form() {

  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createPassword, initialState);

  return <form action={formAction}>
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <div className="mb-4">
        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          What's the service?
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="service"
              name="service"
              type="string"
              step="0.01"
              placeholder="Enter the service (Disney+, Netflix)"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          What's the email?
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              step="0.01"
              placeholder="Enter the email (case sensitive)"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>

        <legend className="mb-2 block text-sm font-medium">
          What's the password?
        </legend>
        <div className="relative">
            <input
              id="password"
              name="password"
              type="string"
              step="0.01"
              placeholder="Enter password (case sensitive)"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
    </div>
    <div className="mt-6 flex justify-end gap-4">
      <Link
        href="/dashboard/passwords"
        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
      >
        Cancel
      </Link>
      <Button type="submit">Create Password</Button>
    </div>
  </form>;
}
