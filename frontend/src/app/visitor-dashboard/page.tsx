"use client";

import React, { useState } from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useAuth } from "@/contexts/VisitorAuthContext";
import VisitorCoupleBanner from "@/components/visitor-dashboard/VisitorCoupleBanner";
import VisitorBookingCalendar from "@/components/visitor-dashboard/VisitorBookingCalendar";
import DashboardWidgets from "@/components/visitor-dashboard/DashBoardWidgets";
import WeddingPlanningGuide from "@/components/visitor-dashboard/WeddingPlanningGuide";
import BottomNavigationBar from "@/components/visitor-dashboard/BottomNavigationBar";
import LoaderHelix from "@/components/shared/Loaders/LoaderHelix";
import { StaticImageData } from "next/image";
import {
  GET_VISITOR_BY_ID,
  FIND_ALL_MY_VENDORS,
  FIND_GUESTLIST_BY_VISITOR,
  GET_BUDGET_TOOL,
  GET_VISITOR_CHECKLISTS,
} from "@/graphql/queries";
import { FiSearch } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface Guest {
  id: string;
  status: string;
}

interface BudgetItem {
  amountPaid?: number;
}

interface Checklist {
  completed: boolean;
}

const VisitorDashboard = () => {
  const { visitor } = useAuth();
  const [profilePic, setProfilePic] = useState<string | StaticImageData>(
    "/images/visitorProfilePic.webp"
  );

  // Get visitor profile data
  const { data, loading, error } = useQuery(GET_VISITOR_BY_ID, {
    variables: { id: visitor?.id },
    skip: !visitor?.id,
    onCompleted: (data) => {
      if (data?.findVisitorById?.profile_pic_url) {
        setProfilePic(data.findVisitorById.profile_pic_url);
      }
    },
  });

  // Get my vendors data
  const { data: vendorsData } = useQuery(FIND_ALL_MY_VENDORS, {
    variables: { visitorId: visitor?.id },
    skip: !visitor?.id,
  });

  // Get guest list data
  const { data: guestListData } = useQuery(FIND_GUESTLIST_BY_VISITOR, {
    variables: { id: visitor?.id },
    skip: !visitor?.id,
  });

  // Get budget data
  const { data: budgetData } = useQuery(GET_BUDGET_TOOL, {
    variables: { visitorId: visitor?.id },
    skip: !visitor?.id,
  });

  // Get checklist data
  const { data: checklistData } = useQuery(GET_VISITOR_CHECKLISTS, {
    variables: { visitorId: visitor?.id },
    skip: !visitor?.id,
  });

  // Calculate all metrics
  const myVendors = vendorsData?.findAllMyVendors || [];
  const guestList = guestListData?.findGuestListsByVisitor || [];

  const attendingGuests = guestList.filter(
    (g: Guest) => g.status === "Attending"
  ).length;
  const declinedGuests = guestList.filter(
    (g: Guest) => g.status === "Declined"
  ).length;
  const invitedGuests = guestList.filter(
    (g: Guest) => g.status === "Invited"
  ).length;
  const notInvitedGuests = guestList.filter(
    (g: Guest) => g.status === "Not Invited"
  ).length;

  const budgetTool = budgetData?.budgetTool;
  const budgetTotal = budgetTool?.totalBudget || 0;
  const budgetItems = budgetTool?.budgetItems || [];

  const budgetSpent = budgetItems.reduce(
    (acc: number, item: BudgetItem) => acc + (item.amountPaid || 0),
    0
  );

  const budgetPercentage =
    budgetTotal > 0
      ? Math.min(Math.round((budgetSpent / budgetTotal) * 100 * 100) / 100, 100)
      : 0;

  const checklists = checklistData?.getVisitorChecklists || [];
  const completedTasks = checklists.filter(
    (task: Checklist) => task.completed
  ).length;
  const totalTasks = checklists.length;
  const checklistProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-lightYellow flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-8">
          <LoaderHelix />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-lightYellow flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl p-8 border border-red-100 text-center max-w-md shadow-sm">
            <p className="text-red-500 font-semibold mb-2">Error loading profile</p>
            <p className="text-gray-500 text-xs">{error.message}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const visitorData = data?.findVisitorById;
  const brideName = visitorData?.partner_fname || "Bride";
  const groomName = visitorData?.visitor_fname || "Groom";

  return (
    <div className="min-h-screen bg-lightYellow flex flex-col font-body">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Top Header Banner matching Vendor Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-orange/10 text-orange border border-orange/20">
                Wedding Planning Portal
              </span>
            </div>
            <h1 className="font-title text-3xl font-bold text-gray-900">
              Wedding Dashboard
            </h1>
            <p className="text-gray-500 font-body text-sm mt-1">
              Welcome back, {brideName} & {groomName}! Track your vendor bookings, wedding countdown, and planning milestones.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Link
              href="/vendor-search"
              className="inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm text-xs"
            >
              <FiSearch size={15} />
              <span>Explore Vendors</span>
            </Link>
            <Link
              href={visitor?.id ? `/visitor-dashboard/checklist/${visitor.id}` : "/sign-up"}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-orange/5 text-gray-700 hover:text-orange font-semibold px-4 py-2.5 rounded-xl border border-orange/20 transition-all shadow-2xs text-xs"
            >
              <IoMdCheckmarkCircleOutline size={15} className="text-orange" />
              <span>Checklist</span>
            </Link>
          </div>
        </div>

        {/* Asymmetric Profile Hub + Booking Calendar Layout (4 cols + 8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-10 items-start">
          {/* Left Column (4 cols): Couple Profile & Integrated Planning Hub */}
          <div className="lg:col-span-4">
            <VisitorCoupleBanner
              visitorData={visitorData}
              visitorId={visitor?.id}
              profilePic={profilePic}
              setProfilePic={setProfilePic}
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              budgetPercentage={budgetPercentage}
              myVendorsCount={myVendors.length}
              attendingGuests={attendingGuests}
            />
          </div>

          {/* Right Column (8 cols): Visitor Booking Calendar (Vendor Template) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {visitor?.id ? (
              <VisitorBookingCalendar visitorId={visitor.id} />
            ) : (
              <div className="bg-white rounded-2xl border border-orange/20 p-8 text-center text-gray-500 text-sm">
                Log in to view your wedding calendar.
              </div>
            )}
          </div>
        </div>

        {/* Planning Overview Widgets Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <h2 className="font-title text-xl sm:text-2xl font-bold text-gray-900">
                Planning Overview
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange/10 text-orange">
                4 Active Tools
              </span>
            </div>
          </div>

          <DashboardWidgets
            myVendors={myVendors}
            attendingGuests={attendingGuests}
            declinedGuests={declinedGuests}
            invitedGuests={invitedGuests}
            notInvitedGuests={notInvitedGuests}
            totalGuests={guestList.length}
            budgetTotal={budgetTotal}
            budgetSpent={budgetSpent}
            budgetPercentage={budgetPercentage}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            checklistProgress={checklistProgress}
            visitorId={visitor?.id}
          />
        </div>

        {/* Wedding Planning Guide Banner */}
        <div className="mb-8">
          <WeddingPlanningGuide />
        </div>
      </main>

      <BottomNavigationBar />
      <Footer />
    </div>
  );
};

export default VisitorDashboard;
