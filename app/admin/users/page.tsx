"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Search, Eye, User, X } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserDetailsData {
  id: string;
  basicInfo: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    address: string | null;
    joinedDate: string | null;
  };
  subscriptionInfo: {
    activeSubscriptionsCount: number;
    totalSubscriptionsCount: number;
  };
  orderInfo: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
  };
  paymentInfo: {
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    totalAmountSpent: string;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetailsData | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter !== "ALL") params.append("role", roleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetails = async (user: UserData) => {
    setSelectedUser(user);
    setIsDetailsLoading(true);
    setUserDetails(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setUserDetails(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 w-full flex-1 transition-colors">
      <div className="w-full px-4 md:px-8 py-6">
        <div className="space-y-6">
          <PageHeader title="Users" />

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">User</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Role</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Joined</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-900 dark:divide-slate-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 dark:bg-slate-800">
                            <User className="h-8 w-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No users found</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search to find what you're looking for.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900/30 dark:text-blue-400">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'ADMIN' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' 
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleOpenDetails(user)}
                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center justify-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-6">
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={handleCloseDetails}></div>

                <div className="inline-block bg-white dark:bg-slate-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all max-w-2xl w-full border border-slate-200 dark:border-slate-800 z-10 my-8">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white" id="modal-title">
                      User Details
                    </h3>
                    <button onClick={handleCloseDetails} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    {isDetailsLoading ? (
                      <div className="py-12 flex flex-col items-center justify-center space-y-3">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading user details...</p>
                      </div>
                    ) : userDetails ? (
                      <>
                        {/* BASIC INFORMATION */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                            Basic Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Full Name</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userDetails.basicInfo.fullName || "No data available"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userDetails.basicInfo.email || "No data available"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Phone Number</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userDetails.basicInfo.phone || "No data available"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Gender</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userDetails.basicInfo.gender || "No data available"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Date of Birth</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userDetails.basicInfo.dateOfBirth || "No data available"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Joined Date</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userDetails.basicInfo.joinedDate || "No data available"}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs text-slate-500 dark:text-slate-400">Address</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userDetails.basicInfo.address || "No data available"}</p>
                            </div>
                          </div>
                        </div>

                        {/* SUBSCRIPTION INFORMATION */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                            Subscription Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Active Subscriptions Count</p>
                              <p className="text-base font-bold text-[#00b386] dark:text-[#00b386]">{userDetails.subscriptionInfo.activeSubscriptionsCount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Total Subscriptions Count</p>
                              <p className="text-base font-bold text-slate-900 dark:text-white">{userDetails.subscriptionInfo.totalSubscriptionsCount}</p>
                            </div>
                          </div>
                        </div>

                        {/* ORDER INFORMATION */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                            Order Information
                          </h4>
                          <div className="grid grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Total Orders</p>
                              <p className="text-base font-bold text-slate-900 dark:text-white">{userDetails.orderInfo.totalOrders}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Completed Orders</p>
                              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{userDetails.orderInfo.completedOrders}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Pending Orders</p>
                              <p className="text-base font-bold text-amber-600 dark:text-amber-400">{userDetails.orderInfo.pendingOrders}</p>
                            </div>
                          </div>
                        </div>

                        {/* PAYMENT INFORMATION */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                            Payment Information
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Total Payments</p>
                              <p className="text-base font-bold text-slate-900 dark:text-white">{userDetails.paymentInfo.totalPayments}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Successful Payments</p>
                              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{userDetails.paymentInfo.successfulPayments}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Failed Payments</p>
                              <p className="text-base font-bold text-red-600 dark:text-red-400">{userDetails.paymentInfo.failedPayments}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Total Amount Spent</p>
                              <p className="text-base font-bold text-blue-600 dark:text-blue-400">{userDetails.paymentInfo.totalAmountSpent}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                        No user details available.
                      </div>
                    )}
                  </div>

                  {/* Modal Footer - Single Close Button */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button
                      type="button"
                      onClick={handleCloseDetails}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
