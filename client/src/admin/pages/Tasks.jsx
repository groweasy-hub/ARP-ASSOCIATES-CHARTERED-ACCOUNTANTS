import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import api from "../api";
import { toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  h2 {
    margin: 0 0 4px;
    color: #0d2244;
    font-size: 1.08rem;
  }
  p {
    margin: 0;
    color: #33425e;
    font-size: 0.78rem;
  }
`;
const Grid = styled.div`
  display: grid;
  gap: 12px;
`;
const Card = styled.div`
  background: #fff;
  border: 1px solid rgba(13, 34, 68, 0.07);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(11, 31, 60, 0.06);
  padding: 14px;
`;
const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  h3 {
    margin: 0 0 4px;
    color: #0d2244;
    font-size: 0.9rem;
  }
  p {
    margin: 0;
    color: #33425e;
    font-size: 0.76rem;
  }
`;
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: #f6fbff;
  color: #0254a0;
  font-size: 0.68rem;
  font-weight: 800;
`;
const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin-top: 10px;
`;
const MetaItem = styled.div`
  display: grid;
  gap: 3px;
  padding: 8px 10px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 8px;
  background: #fff;
  font-size: 0.76rem;
  strong {
    color: #33425e;
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  span {
    color: #0d2244;
    font-weight: 700;
  }
`;
const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(160px, 220px) 1fr auto;
  gap: 8px;
  margin-top: 12px;
  select,
  input {
    height: 36px;
    border: 1px solid rgba(13, 34, 68, 0.16);
    border-radius: 7px;
    padding: 0 10px;
    font: inherit;
    font-size: 0.78rem;
    outline: none;
  }
  button {
    height: 36px;
    padding: 0 14px;
    border: 0;
    border-radius: 7px;
    background: linear-gradient(135deg, #2c649c, #0254a0);
    color: #fff;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
const Comments = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 6px;
  color: #33425e;
  font-size: 0.74rem;
`;
const Description = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  background: #f6fbff;
  color: #0d2244;
  font-size: 0.76rem;
  line-height: 1.5;
  strong {
    display: block;
    margin-bottom: 4px;
    color: #33425e;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;
const Empty = styled.div`
  padding: 34px 16px;
  text-align: center;
  color: #33425e;
  background: #fff;
  border-radius: 10px;
`;
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
`;
const StatButton = styled.button`
  min-height: 78px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 13px;
  border: 1px solid
    ${({ $active, $tone }) =>
      $active ? $tone.border : "rgba(13, 34, 68, 0.08)"};
  border-radius: 8px;
  background: ${({ $active, $tone }) => ($active ? $tone.bg : "#fff")};
  box-shadow: ${({ $active, $tone }) =>
    $active
      ? `0 4px 16px ${$tone.shadow}`
      : "0 2px 10px rgba(11, 31, 60, 0.05)"};
  color: #0d2244;
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: ${({ $tone }) => $tone.border};
    box-shadow: ${({ $tone }) => `0 4px 16px ${$tone.shadow}`};
    transform: translateY(-1px);
  }
`;
const StatIcon = styled.span`
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${({ $tone }) => $tone.iconBg};
  color: ${({ $tone }) => $tone.color};

  svg {
    width: 19px;
    height: 19px;
  }
`;
const StatText = styled.span`
  display: grid;
  gap: 6px;
`;
const StatLabel = styled.span`
  color: #33425e;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
const StatValue = styled.span`
  color: #0d2244;
  font-size: 1.42rem;
  font-weight: 800;
  line-height: 1;
`;
const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  color: #33425e;
  font-size: 0.78rem;

  button,
  select {
    height: 30px;
    padding: 0 10px;
    border: 1px solid rgba(13, 34, 68, 0.12);
    border-radius: 7px;
    background: #fff;
    color: #0d2244;
    cursor: pointer;
    font: inherit;
    font-size: 0.74rem;
    font-weight: 700;
  }

  select {
    min-width: 220px;
    outline: none;
  }
`;
const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const DesktopTasks = styled.div`
  @media (max-width: 760px) {
    display: none;
  }
`;

const MobileTasks = styled.div`
  display: none;

  @media (max-width: 760px) {
    display: grid;
    gap: 22px;
  }
`;

const MobileSectionTitle = styled.h2`
  margin: 0 0 2px;
  color: #071e49;
  font-size: 1.18rem;
  font-weight: 800;
`;

const MobileStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 390px) {
    gap: 8px;
  }
`;

const MobileStatCard = styled.button`
  grid-column: span 2;
  min-height: 116px;
  display: grid;
  align-content: start;
  gap: 11px;
  padding: 14px;
  border: 1px solid
    ${({ $active, $tone }) =>
      $active ? $tone.border : "rgba(13, 34, 68, 0.07)"};
  border-radius: 14px;
  background: ${({ $active, $tone }) => ($active ? $tone.bg : "#ffffff")};
  box-shadow: 0 10px 24px rgba(11, 31, 60, 0.07);
  color: #071e49;
  text-align: left;
  font: inherit;
`;

const MobileWideStatCard = styled(MobileStatCard)`
  grid-column: span 3;
`;

const MobileStatIcon = styled.span`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: ${({ $tone }) => $tone.iconBg};
  color: ${({ $tone }) => $tone.color};

  svg {
    width: 19px;
    height: 19px;
  }
`;

const MobileStatLabel = styled.span`
  display: block;
  color: #071e49;
  font-size: 0.68rem;
  font-weight: 700;
`;

const MobileStatValue = styled.strong`
  display: block;
  color: #071e49;
  font-size: 1.15rem;
  line-height: 1;
`;

const MobileCurrentSection = styled.div`
  display: grid;
  gap: 12px;
`;

const MobileTaskCard = styled.button`
  width: 100%;
  display: block;
  padding: 14px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(11, 31, 60, 0.07);
  color: inherit;
  font: inherit;
  text-align: left;
`;

const MobileTaskHeader = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: center;
`;

const MobileTaskIcon = styled.span`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #fff4e8;
  color: #ea580c;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const MobileTaskTitle = styled.div`
  min-width: 0;

  h3 {
    margin: 0;
    color: #071e49;
    font-size: 0.86rem;
    font-weight: 800;
    line-height: 1.25;
  }

  p {
    margin: 5px 0 0;
    color: #52627d;
    font-size: 0.72rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MobileChevron = styled.span`
  color: #64748b;
  line-height: 0;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MobileCompactMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 14px;
`;

const MobileCompactMetaItem = styled.div`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-height: 44px;
  padding: 7px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 8px;

  i {
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: #eef6ff;
    color: #0b66d8;
    font-style: normal;
  }

  svg {
    width: 15px;
    height: 15px;
  }

  label {
    display: block;
    color: #64748b;
    font-size: 0.54rem;
    font-weight: 800;
  }

  span {
    display: block;
    margin-top: 2px;
    color: #071e49;
    font-size: 0.58rem;
    font-weight: 800;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MobileTaskDescription = styled.div`
  margin-top: 12px;
  padding: 10px;
  border-top: 1px solid rgba(13, 34, 68, 0.08);
  color: #071e49;
  font-size: 0.72rem;
`;

const MobileExpandedTask = styled.div`
  padding: 16px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(11, 31, 60, 0.07);
`;

const MobileDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 16px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 10px;
  overflow: hidden;
`;

const MobileDetailCell = styled.div`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 58px;
  padding: 10px;
  border-right: 1px solid rgba(13, 34, 68, 0.08);
  border-bottom: 1px solid rgba(13, 34, 68, 0.08);

  &:nth-child(2n) {
    border-right: 0;
  }

  &:nth-last-child(-n + 2) {
    border-bottom: 0;
  }

  i {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: ${({ $bg }) => $bg || "#eef6ff"};
    color: ${({ $color }) => $color || "#0b66d8"};
    font-style: normal;
  }

  svg {
    width: 17px;
    height: 17px;
  }

  label {
    display: block;
    color: #64748b;
    font-size: 0.54rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #071e49;
    font-size: 0.64rem;
    font-weight: 800;
  }
`;

const MobileDescriptionBox = styled.div`
  margin-top: 14px;
  padding: 11px;
  border-radius: 9px;
  background: #f6fbff;
  color: #071e49;
  font-size: 0.72rem;
  line-height: 1.45;

  strong {
    display: block;
    margin-bottom: 8px;
    color: #33425e;
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

const MobileTaskForm = styled.form`
  display: grid;
  gap: 9px;
  margin-top: 14px;

  label {
    color: #33425e;
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  select,
  input {
    width: 100%;
    height: 38px;
    box-sizing: border-box;
    border: 1px solid rgba(13, 34, 68, 0.14);
    border-radius: 8px;
    padding: 0 11px;
    background: #ffffff;
    color: #071e49;
    font: inherit;
    font-size: 0.72rem;
    outline: none;
  }

  button {
    height: 40px;
    border: 0;
    border-radius: 8px;
    background: linear-gradient(135deg, #2b78ea, #075dcc);
    color: #ffffff;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 800;
  }
`;

const statusOptions = [
  "In Progress",
  "Pending",
  "Waiting for Client",
  "Completed",
];
const statTones = {
  assigned: {
    color: "#0254a0",
    bg: "#f6fbff",
    iconBg: "#dceeff",
    border: "rgba(2, 84, 160, 0.34)",
    shadow: "rgba(2, 84, 160, 0.12)",
  },
  "in-progress": {
    color: "#0369a1",
    bg: "#f0f9ff",
    iconBg: "#e0f2fe",
    border: "rgba(14, 165, 233, 0.38)",
    shadow: "rgba(14, 165, 233, 0.14)",
  },
  pending: {
    color: "#b45309",
    bg: "#fff8ed",
    iconBg: "#ffedd5",
    border: "rgba(245, 158, 11, 0.42)",
    shadow: "rgba(245, 158, 11, 0.14)",
  },

  waiting: {
    color: "#7c3aed",
    bg: "#f8f5ff",
    iconBg: "#ede9fe",
    border: "rgba(124, 58, 237, 0.34)",
    shadow: "rgba(124, 58, 237, 0.13)",
  },
  "completed-month": {
    color: "#047857",
    bg: "#effcf6",
    iconBg: "#d1fae5",
    border: "rgba(16, 185, 129, 0.38)",
    shadow: "rgba(16, 185, 129, 0.14)",
  },
};
const statIcons = {
  assigned: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  ),
  "in-progress": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  pending: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),

  waiting: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </svg>
  ),
  "completed-month": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
};
const taskFilters = [
  { key: "assigned", label: "Tasks Assigned" },
  { key: "in-progress", label: "In Progress" },
  { key: "pending", label: "Tasks Pending" },
  { key: "waiting", label: "Waiting for Clients" },
  { key: "completed-month", label: "Completed This Month" },
];

const isThisMonth = (value) => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

const isCompletedTask = (task) => task.workStatus === "Completed";

const formatTaskDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState({});
  const [selectedMobileTaskId, setSelectedMobileTaskId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { admin } = useAuth();
  const activeFilter = searchParams.get("filter") || "all";
  const selectedEmployee = searchParams.get("employee") || "all";
  const focusedTaskId = searchParams.get("task");
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.get("/tasks");
    if (res.success) setTasks(res.tasks || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    api.get("/users").then((res) => {
      if (res.success) {
        setEmployees(
          (res.users || []).filter(
            (user) => user.role !== "SUPER_ADMIN" && user.status !== "Inactive",
          ),
        );
      }
    });
  }, [isSuperAdmin]);

  useEffect(() => {
    if (!focusedTaskId || loading) return;
    const taskExists = tasks.some((task) => String(task.id) === String(focusedTaskId));
    if (taskExists) setSelectedMobileTaskId(focusedTaskId);
  }, [focusedTaskId, loading, tasks]);

  const updateTask = async (event, task) => {
    event.preventDefault();
    const values = updates[task.id] || {};
    if (!values.comment) {
      toast.error("Please enter a comment");
      return;
    }
    const res = await api.patch(`/tasks/${task.id}/status`, {
      workStatus: values.workStatus || task.workStatus,
      comment: values.comment,
    });
    if (res.success) {
      toast.success("Task updated");
      setUpdates((current) => ({ ...current, [task.id]: {} }));
      load();
    } else {
      toast.error(res.message || "Unable to update task");
    }
  };

  const taskCounts = useMemo(
    () => ({
      assigned: tasks.filter((task) => task.assignedTo && !isCompletedTask(task))
        .length,
      pending: tasks.filter((task) => task.workStatus === "Pending").length,
      "in-progress": tasks.filter((task) => task.workStatus === "In Progress")
        .length,
      waiting: tasks.filter((task) => task.workStatus === "Waiting for Client")
        .length,
      "completed-month": tasks.filter(
        (task) =>
          task.workStatus === "Completed" && isThisMonth(task.updatedAt),
      ).length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    if (!isSuperAdmin || activeFilter === "all") {
      return tasks.filter((task) => !isCompletedTask(task));
    }
    if (activeFilter === "assigned") {
      return tasks.filter(
        (task) =>
          task.assignedTo &&
          !isCompletedTask(task) &&
          (selectedEmployee === "all" ||
            String(task.assignedTo.id) === selectedEmployee),
      );
    }
    if (activeFilter === "pending")
      return tasks.filter((task) => task.workStatus === "Pending");
    if (activeFilter === "in-progress") {
      return tasks.filter((task) => task.workStatus === "In Progress");
    }
    if (activeFilter === "waiting") {
      return tasks.filter((task) => task.workStatus === "Waiting for Client");
    }
    if (activeFilter === "completed-month") {
      return tasks.filter(
        (task) =>
          task.workStatus === "Completed" && isThisMonth(task.updatedAt),
      );
    }
    return tasks;
  }, [activeFilter, isSuperAdmin, selectedEmployee, tasks]);

  const selectedFilter = taskFilters.find((item) => item.key === activeFilter);
  const selectFilter = (key) => {
    if (activeFilter === key) {
      setSearchParams({});
    } else {
      setSearchParams({ filter: key });
    }
  };
  const selectEmployee = (employeeId) => {
    if (employeeId === "all") {
      setSearchParams({ filter: "assigned" });
    } else {
      setSearchParams({ filter: "assigned", employee: employeeId });
    }
  };

  return (
    <>
    <DesktopTasks>
      <PageHeader>
        <div>
          <h2>Tasks</h2>
          <p>Assigned client compliance work and status updates.</p>
        </div>
      </PageHeader>

      {isSuperAdmin && (
        <>
          <StatsGrid>
            {taskFilters.map((item) => (
              <StatButton
                key={item.key}
                type="button"
                $active={activeFilter === item.key}
                $tone={statTones[item.key]}
                onClick={() => selectFilter(item.key)}
                title={`Show ${item.label.toLowerCase()}`}
              >
                <StatIcon $tone={statTones[item.key]}>
                  {statIcons[item.key]}
                </StatIcon>
                <StatText>
                  <StatLabel>{item.label}</StatLabel>
                  <StatValue>{taskCounts[item.key] || 0}</StatValue>
                </StatText>
              </StatButton>
            ))}
          </StatsGrid>
          {activeFilter !== "all" && (
            <FilterBar>
              <span>
                Showing {filteredTasks.length}{" "}
                {selectedFilter?.label.toLowerCase() || "filtered tasks"}
              </span>
              <FilterControls>
                {activeFilter === "assigned" && (
                  <select
                    value={selectedEmployee}
                    onChange={(event) => selectEmployee(event.target.value)}
                    aria-label="Filter assigned tasks by employee"
                  >
                    <option value="all">All employees</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name || employee.email}
                      </option>
                    ))}
                  </select>
                )}
                <button type="button" onClick={() => setSearchParams({})}>
                  Clear Filter
                </button>
              </FilterControls>
            </FilterBar>
          )}
        </>
      )}

      {loading ? (
        <Empty>Loading tasks...</Empty>
      ) : filteredTasks.length === 0 ? (
        <Empty>
          {activeFilter === "all"
            ? "No tasks assigned"
            : "No tasks found for this filter"}
        </Empty>
      ) : (
        <Grid>
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardTop>
                <div>
                  <h3>{task.service}</h3>
                  <p>
                    {task.client?.companyName || task.client?.name || "Client"}
                  </p>
                </div>
                <Badge>{task.workStatus}</Badge>
              </CardTop>
              <MetaGrid>
                <MetaItem>
                  <strong>Assigned To</strong>
                  <span>
                    {task.assignedTo?.name || task.assignedTo?.email || "-"}
                  </span>
                </MetaItem>
                <MetaItem>
                  <strong>Deadline</strong>
                  <span>
                    {task.dueDate ? String(task.dueDate).slice(0, 10) : "-"}
                  </span>
                </MetaItem>
                <MetaItem>
                  <strong>Status</strong>
                  <span>{task.workStatus || "-"}</span>
                </MetaItem>
                <MetaItem>
                  <strong>Preference</strong>
                  <span>{task.workPreference || "-"}</span>
                </MetaItem>
              </MetaGrid>
              <Description>
                <strong>Description</strong>
                {task.description || "-"}
              </Description>
              <Form onSubmit={(event) => updateTask(event, task)}>
                <select
                  value={updates[task.id]?.workStatus || task.workStatus}
                  onChange={(e) =>
                    setUpdates({
                      ...updates,
                      [task.id]: {
                        ...(updates[task.id] || {}),
                        workStatus: e.target.value,
                      },
                    })
                  }
                >
                  {statusOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <input
                  placeholder="Enter what is the status in comments"
                  value={updates[task.id]?.comment || ""}
                  onChange={(e) =>
                    setUpdates({
                      ...updates,
                      [task.id]: {
                        ...(updates[task.id] || {}),
                        comment: e.target.value,
                      },
                    })
                  }
                />
                <button type="submit">Update</button>
              </Form>
              {task.comments?.length > 0 && (
                <Comments>
                  {task.comments.slice(-3).map((comment) => (
                    <div key={comment._id || comment.createdAt}>
                      <strong>{comment.status || "Comment"}:</strong>{" "}
                      {comment.text}
                    </div>
                  ))}
                </Comments>
              )}
            </Card>
          ))}
        </Grid>
      )}
    </DesktopTasks>

    <MobileTasks>
      <section>
        <MobileSectionTitle>Tasks Overview</MobileSectionTitle>
        <MobileStatsGrid>
          {taskFilters.map((item, index) => {
            const StatCardComponent = index > 2 ? MobileWideStatCard : MobileStatCard;
            return (
              <StatCardComponent
                key={item.key}
                type="button"
                $active={activeFilter === item.key}
                $tone={statTones[item.key]}
                onClick={() => selectFilter(item.key)}
              >
                <MobileStatIcon $tone={statTones[item.key]}>
                  {statIcons[item.key]}
                </MobileStatIcon>
                <MobileStatLabel>{item.label}</MobileStatLabel>
                <MobileStatValue>{taskCounts[item.key] || 0}</MobileStatValue>
              </StatCardComponent>
            );
          })}
        </MobileStatsGrid>
      </section>

      <MobileCurrentSection>
        <MobileSectionTitle>
          {selectedMobileTaskId ? "Current Task" : "Current Tasks"}
        </MobileSectionTitle>
        {loading ? (
          <Empty>Loading tasks...</Empty>
        ) : filteredTasks.length === 0 ? (
          <Empty>
            {activeFilter === "all"
              ? "No tasks assigned"
              : "No tasks found for this filter"}
          </Empty>
        ) : (
          filteredTasks.map((task) => {
            const isOpen = selectedMobileTaskId === task.id;
            return isOpen ? (
              <MobileExpandedTask key={task.id}>
                <MobileTaskHeader>
                  <MobileTaskIcon>
                    {statIcons.pending}
                  </MobileTaskIcon>
                  <MobileTaskTitle>
                    <h3>{task.service}</h3>
                    <p>{task.client?.companyName || task.client?.name || "Client"}</p>
                  </MobileTaskTitle>
                  <Badge>{task.workStatus}</Badge>
                  <MobileChevron onClick={() => setSelectedMobileTaskId(null)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6" /></svg>
                  </MobileChevron>
                </MobileTaskHeader>

                <MobileDetailGrid>
                  <MobileDetailCell>
                    <i>{statIcons.assigned}</i>
                    <div>
                      <label>Assigned To</label>
                      <span>{task.assignedTo?.name || task.assignedTo?.email || "-"}</span>
                    </div>
                  </MobileDetailCell>
                  <MobileDetailCell>
                    <i>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
                    </i>
                    <div>
                      <label>Deadline</label>
                      <span>{formatTaskDate(task.dueDate)}</span>
                    </div>
                  </MobileDetailCell>
                  <MobileDetailCell>
                    <i>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                    </i>
                    <div>
                      <label>Status</label>
                      <span>{task.workStatus || "-"}</span>
                    </div>
                  </MobileDetailCell>
                  <MobileDetailCell $bg="#fee2e2" $color="#ef4444">
                    <i>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22V15" /></svg>
                    </i>
                    <div>
                      <label>Preference</label>
                      <span>{task.workPreference || "-"}</span>
                    </div>
                  </MobileDetailCell>
                </MobileDetailGrid>

                <MobileDescriptionBox>
                  <strong>Description</strong>
                  {task.description || "-"}
                </MobileDescriptionBox>

                <MobileTaskForm onSubmit={(event) => updateTask(event, task)}>
                  <label>Update Status</label>
                  <select
                    value={updates[task.id]?.workStatus || task.workStatus}
                    onChange={(e) =>
                      setUpdates({
                        ...updates,
                        [task.id]: {
                          ...(updates[task.id] || {}),
                          workStatus: e.target.value,
                        },
                      })
                    }
                  >
                    {statusOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Enter status comments"
                    value={updates[task.id]?.comment || ""}
                    onChange={(e) =>
                      setUpdates({
                        ...updates,
                        [task.id]: {
                          ...(updates[task.id] || {}),
                          comment: e.target.value,
                        },
                      })
                    }
                  />
                  <button type="submit">Update</button>
                </MobileTaskForm>
              </MobileExpandedTask>
            ) : (
              <MobileTaskCard
                key={task.id}
                type="button"
                onClick={() => setSelectedMobileTaskId(task.id)}
              >
                <MobileTaskHeader>
                  <MobileTaskIcon>{statIcons.pending}</MobileTaskIcon>
                  <MobileTaskTitle>
                    <h3>{task.service}</h3>
                    <p>{task.client?.companyName || task.client?.name || "Client"}</p>
                  </MobileTaskTitle>
                  <Badge>{task.workStatus}</Badge>
                  <MobileChevron>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                  </MobileChevron>
                </MobileTaskHeader>
                <MobileCompactMeta>
                  <MobileCompactMetaItem>
                    <i>{statIcons.assigned}</i>
                    <div>
                      <label>Assigned to:</label>
                      <span>{task.assignedTo?.name || task.assignedTo?.email || "-"}</span>
                    </div>
                  </MobileCompactMetaItem>
                  <MobileCompactMetaItem>
                    <i>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
                    </i>
                    <div>
                      <label>Due:</label>
                      <span>{formatTaskDate(task.dueDate)}</span>
                    </div>
                  </MobileCompactMetaItem>
                  <MobileCompactMetaItem>
                    <i>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22V15" /></svg>
                    </i>
                    <div>
                      <label>Priority:</label>
                      <span>{task.workPreference || "-"}</span>
                    </div>
                  </MobileCompactMetaItem>
                </MobileCompactMeta>
                <MobileTaskDescription>{task.description || "-"}</MobileTaskDescription>
              </MobileTaskCard>
            );
          })
        )}
      </MobileCurrentSection>
    </MobileTasks>
    </>
  );
}
