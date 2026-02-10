"use client";

import React, { useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  DocumentPlusIcon,
  InboxIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { logout } from "@/utils/firebaseHelpers";

export type DashboardRole = "customer" | "company" | "admin";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: DashboardRole;
  user?: {
    displayName?: string;
    email?: string;
    photoURL?: string;
  } | null;
  companyName?: string;
  navigation?: NavItem[];
  activeTab?: string;
  stats?: {
    label: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
  }[];
  showStats?: boolean;
  headerActions?: React.ReactNode;
}

// Default navigation per role
const defaultNavigation: Record<DashboardRole, NavItem[]> = {
  customer: [
    {
      name: "Cererile Mele",
      href: "/customer/dashboard",
      icon: DocumentTextIcon,
    },
    {
      name: "Cerere Nouă",
      href: "/customer/cerere-noua",
      icon: DocumentPlusIcon,
    },
    {
      name: "Setări",
      href: "/customer/settings",
      icon: Cog6ToothIcon,
    },
  ],
  company: [
    {
      name: "Cereri Disponibile",
      href: "/company/dashboard?tab=requests",
      icon: InboxIcon,
    },
    {
      name: "Ofertele Mele",
      href: "/company/dashboard?tab=offers",
      icon: DocumentTextIcon,
    },
    { name: "Credite", href: "/company/credits", icon: CreditCardIcon },
    {
      name: "Profil Companie",
      href: "/company/profile",
      icon: BuildingOfficeIcon,
    },
    { name: "Setări", href: "/company/settings", icon: Cog6ToothIcon },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: ChartBarIcon },
    { name: "Utilizatori", href: "/admin/users", icon: UsersIcon },
    { name: "Companii", href: "/admin/companies", icon: BuildingOfficeIcon },
    { name: "Cereri", href: "/admin/requests", icon: DocumentTextIcon },
    { name: "Verificări", href: "/admin/verifications", icon: ShieldCheckIcon },
    { name: "Setări", href: "/admin/settings", icon: Cog6ToothIcon },
  ],
};

const roleColors: Record<
  DashboardRole,
  { primary: string; accent: string; bg: string }
> = {
  customer: {
    primary: "emerald",
    accent: "from-emerald-500 to-teal-500",
    bg: "bg-white border-r border-gray-200",
  },
  company: {
    primary: "emerald",
    accent: "from-emerald-500 to-teal-500",
    bg: "bg-white border-r border-gray-200",
  },
  admin: {
    primary: "purple",
    accent: "from-purple-500 to-pink-500",
    bg: "bg-white border-r border-gray-200",
  },
};

const roleLabels: Record<DashboardRole, string> = {
  customer: "Client",
  company: "Companie",
  admin: "Administrator",
};

const NAV_ACTIVE_STYLES: Record<DashboardRole, { container: string; icon: string; desktopExtra: string }> = {
  customer: { container: "bg-emerald-50 text-emerald-700", icon: "text-emerald-600", desktopExtra: "border-l-2 border-emerald-500" },
  company: { container: "bg-emerald-50 text-emerald-700", icon: "text-emerald-600", desktopExtra: "border-l-2 border-emerald-500" },
  admin: { container: "bg-purple-50 text-purple-700", icon: "text-purple-600", desktopExtra: "border-l-2 border-purple-500" },
};

function UserAvatar({ role, photoURL }: { role: DashboardRole; photoURL?: string }) {
  if (photoURL && (role === "company" || role === "customer")) {
    return <Image src={photoURL} alt={role === "company" ? "Logo" : "Avatar"} width={40} height={40} className="h-full w-full rounded-full object-cover" />;
  }
  if (role === "company") {
    return <Image src="/pics/default-company.svg" alt="Logo" width={40} height={40} className="h-full w-full rounded-full object-cover" />;
  }
  if (role === "customer") {
    return <UserCircleIcon className="h-5 w-5 text-white" />;
  }
  return <ShieldCheckIcon className="h-5 w-5 text-white" />;
}

export default function DashboardLayout({
  children,
  role,
  user,
  companyName,
  navigation,
  activeTab,
  stats,
  showStats = false,
  headerActions,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = navigation || defaultNavigation[role];
  const colors = roleColors[role];

  // Determine current nav item
  const currentPath = router.asPath;
  const navWithCurrent = nav.map((item) => ({
    ...item,
    current: activeTab
      ? item.href.includes(activeTab)
      : currentPath.startsWith(item.href.split("?")[0]),
  }));

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  // For companies, use companyName if available, otherwise use displayName
  const userName =
    role === "company" && companyName
      ? companyName
      : user?.displayName || user?.email?.split("@")[0] || roleLabels[role];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Închide sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                {/* Mobile Sidebar content */}
                <div className="flex grow flex-col overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-1">
                      <span className="text-xl font-bold text-emerald-600">
                        Ofertemutare
                      </span>
                      <sup className="text-[10px] font-bold text-gray-400">
                        .ro
                      </sup>
                    </Link>
                  </div>

                  {/* User info mobile */}
                  <div className="py-4">
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-emerald-500 to-teal-500">
                        <UserAvatar role={role} photoURL={user?.photoURL} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {roleLabels[role]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-4">
                      <li>
                        <ul role="list" className="space-y-1">
                          {navWithCurrent.map((item) => {
                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                                    item.current
                                      ? NAV_ACTIVE_STYLES[role].container
                                      : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <item.icon
                                    className={`h-5 w-5 shrink-0 ${item.current ? NAV_ACTIVE_STYLES[role].icon : "text-gray-400"}`}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                      <li className="mt-auto border-t border-gray-100 pt-4">
                        <Link
                          href="/"
                          onClick={() => setSidebarOpen(false)}
                          className="group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <HomeIcon className="h-5 w-5 text-gray-400" />
                          Înapoi la site
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="group flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                          Deconectare
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar — collapsed icon-only at md:, full at lg: */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-16 md:flex-col lg:w-64">
        <div className={`flex grow flex-col overflow-y-auto ${colors.bg}`}>
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-center border-b border-gray-100 px-2 lg:justify-start lg:px-6">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-xl font-bold text-emerald-600">
                <span className="hidden lg:inline">Ofertemutare</span>
                <span className="lg:hidden">OM</span>
              </span>
              <sup className="hidden text-[10px] font-bold text-gray-400 lg:inline">.ro</sup>
            </Link>
          </div>

          {/* User info — hidden on tablet, visible on desktop */}
          <div className="hidden px-4 py-4 lg:block">
            <div className="flex items-center gap-3 rounded-xl bg-linear-to-r from-gray-50 to-gray-100/50 p-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-emerald-500 to-teal-500 shadow-sm">
                <UserAvatar role={role} photoURL={user?.photoURL} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {userName}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {roleLabels[role]}
                </p>
              </div>
            </div>
          </div>
          {/* User avatar — tablet collapsed sidebar */}
          <div className="flex justify-center py-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-emerald-500 to-teal-500 shadow-sm">
              <UserAvatar role={role} photoURL={user?.photoURL} />
            </div>
          </div>

          <nav className="flex flex-1 flex-col px-2 lg:px-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              <li>
                <ul role="list" className="space-y-1">
                  {navWithCurrent.map((item) => {
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          title={item.name}
                          className={`group flex items-center justify-center gap-x-3 rounded-lg px-1.5 py-2.5 text-sm font-medium transition-all lg:justify-start lg:px-3 ${
                            item.current
                              ? `${NAV_ACTIVE_STYLES[role].container} ${NAV_ACTIVE_STYLES[role].desktopExtra}`
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 ${item.current ? NAV_ACTIVE_STYLES[role].icon : "text-gray-400 group-hover:text-gray-600"}`}
                            aria-hidden="true"
                          />
                          <span className="hidden flex-1 lg:inline">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Bottom section */}
              <li className="mt-auto pb-4 space-y-1 border-t border-gray-100 pt-4">
                <Link
                  href="/"
                  title="Înapoi la site"
                  className="group flex items-center justify-center gap-x-3 rounded-lg px-1.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 lg:justify-start lg:px-3"
                >
                  <HomeIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  <span className="hidden lg:inline">Înapoi la site</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Deconectare"
                  className="group flex w-full items-center justify-center gap-x-3 rounded-lg px-1.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 lg:justify-start lg:px-3"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                  <span className="hidden lg:inline">Deconectare</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-16 lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Deschide sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 md:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Spacer */}
            <div className="flex flex-1 items-center" />

            {/* Right side actions */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {headerActions}

              {/* Profile dropdown mobile */}
              <div className="flex items-center gap-3 md:hidden">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r ${colors.accent} text-sm font-bold text-white`}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        {showStats && stats && stats.length > 0 && (
          <div className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-gray-50 p-4">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </span>
                      {stat.change && (
                        <span
                          className={`text-sm font-medium ${
                            stat.changeType === "positive"
                              ? "text-green-600"
                              : stat.changeType === "negative"
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {stat.change}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children || (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 rounded-lg bg-gray-200" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-32 rounded-xl bg-gray-200" />
                  ))}
                </div>
                <div className="h-64 rounded-xl bg-gray-200" />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
