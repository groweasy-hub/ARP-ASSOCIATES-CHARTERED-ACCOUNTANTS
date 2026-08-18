import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faArrowLeft,
  faBuildingColumns,
  faCalendarDays,
  faClipboardCheck,
  faClock,
  faCommentDots,
  faCreditCard,
  faFileLines,
  faFileCircleCheck,
  faFileInvoice,
  faFileInvoiceDollar,
  faFilter,
  faEye,
  faEnvelope,
  faIdCard,
  faLocationDot,
  faMoneyBillWave,
  faPen,
  faPhone,
  faReceipt,
  faScaleBalanced,
  faSearch,
  faTrashCan,
  faTriangleExclamation,
  faUserCheck,
  faUserTie,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import { toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../permissions";

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;
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

  @media (max-width: 768px) {
    align-items: center;
    gap: 10px;
    margin: 0 0 10px;

    h2 {
      color: #071e49;
      font-size: 1.42rem;
      line-height: 1.12;
      margin-bottom: 6px;
      letter-spacing: 0;
    }

    p {
      color: #33425e;
      font-size: 0.9rem;
      line-height: 1.35;
    }
  }
`;
const Toolbar = styled.div`
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  min-width: 0;
  margin-bottom: 12px;
`;
const ActiveFilterNote = styled.div`
  margin: -4px 0 12px;
  color: #33425e;
  font-size: 0.72rem;
  font-weight: 700;
`;
const Input = styled.input`
  width: 100%;
  max-width: 240px;
  height: 36px;
  padding: 0 11px;
  border: 1.5px solid rgba(13, 34, 68, 0.16);
  border-radius: 7px;
  font: inherit;
  font-size: 0.78rem;
  color: #26395d;
  outline: none;
  &:focus {
    border-color: #0254a0;
  }
`;
const Select = styled.select`
  height: 36px;
  padding: 0 10px;
  border: 1.5px solid rgba(13, 34, 68, 0.16);
  border-radius: 7px;
  background: #fff;
  font: inherit;
  font-size: 0.78rem;
  color: #26395d;
  outline: none;
`;
const PrimaryBtn = styled.button`
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
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const ProfileEditBtn = styled(PrimaryBtn)`
  @media (max-width: 768px) {
    height: 38px;
    min-width: 112px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border-radius: 8px;
    font-size: 0.62rem;
    box-shadow: 0 8px 18px rgba(2, 84, 160, 0.18);
  }
`;
const SecondaryBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(13, 34, 68, 0.16);
  border-radius: 7px;
  background: #fff;
  color: #0d2244;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
`;
const TableWrap = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 18px 45px rgba(11, 31, 60, 0.08);
  border: 1px solid rgba(13, 34, 68, 0.08);
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
`;
const ClientListTableWrap = styled(TableWrap)`
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const DesktopClientsView = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;
const MobileClientsView = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: grid;
    gap: 12px;
  }
`;
const MobileClientsHeader = styled.div`
  h2 {
    margin: 0 0 2px;
    color: #071e49;
    font-size: 1.18rem;
    font-weight: 800;
  }
`;
const MobileSearchBox = styled.label`
  height: 40px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  border: 1px solid rgba(13, 34, 68, 0.14);
  border-radius: 8px;
  background: #ffffff;
  color: #64748b;
  box-shadow: 0 2px 8px rgba(11, 31, 60, 0.03);

  svg {
    width: 14px;
    flex: 0 0 auto;
  }

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: #0d2244;
    font: inherit;
    font-size: 0.78rem;
    background: transparent;
  }
`;
const MobileControlRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
`;
const MobileSelect = styled.select`
  height: 36px;
  padding: 0 10px;
  border: 1px solid rgba(13, 34, 68, 0.14);
  border-radius: 8px;
  background: #fff;
  color: #0d2244;
  font: inherit;
  font-size: 0.74rem;
`;
const MobileFilterBtn = styled.button`
  height: 36px;
  padding: 0 13px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(13, 34, 68, 0.14);
  border-radius: 8px;
  background: #fff;
  color: #0d2244;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
`;
const MobileAddBtn = styled.button`
  height: 36px;
  padding: 0 13px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #2c649c, #0254a0);
  color: #fff;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 800;
  white-space: nowrap;
`;
const MobileStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
`;
const ClientSummaryGrid = styled(MobileStatsGrid)`
  margin-bottom: 14px;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;
const MobileStatCard = styled.div`
  min-height: 100px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  padding: 10px 6px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(11, 31, 60, 0.05);
  text-align: center;

  strong {
    color: #071e49;
    font-size: 1rem;
    line-height: 1;
  }

  span {
    color: #33425e;
    font-size: 0.64rem;
    line-height: 1.25;
  }
`;
const MobileStatIcon = styled.div`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || "#eaf3fb"};
  color: ${({ $color }) => $color || "#0254a0"};

  svg {
    width: 15px;
  }
`;
const MobileClientList = styled.div`
  display: grid;
  gap: 12px;
`;
const MobileClientCard = styled.article`
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(13, 34, 68, 0.09);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(11, 31, 60, 0.05);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #0254a0;
    outline-offset: 2px;
  }
`;
const MobileClientTop = styled.div`
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
`;
const MobileClientLogo = styled.div`
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: ${({ $tone }) => $tone || "#eaf3fb"};
  color: ${({ $color }) => $color || "#0254a0"};

  svg {
    width: 24px;
  }
`;
const MobileClientTitle = styled.div`
  min-width: 0;

  h3 {
    margin: 0 0 5px;
    color: #071e49;
    font-size: 0.93rem;
    font-weight: 800;
    line-height: 1.25;
  }

  p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 7px;
    color: #33425e;
    font-size: 0.72rem;
  }
`;
const MobileClientDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 14px;
  padding-top: 9px;
  border-top: 1px solid rgba(13, 34, 68, 0.08);
`;
const MobileClientMeta = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #33425e;
  font-size: 0.68rem;

  svg {
    width: 12px;
    color: #64748b;
    flex: 0 0 auto;
  }

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const MobileAddress = styled(MobileClientMeta)`
  grid-column: 1 / -1;
`;
const MobileBillingMiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  padding-top: 9px;
  border-top: 1px solid rgba(13, 34, 68, 0.08);
`;
const MobileBillingMini = styled.div`
  min-width: 0;
  display: grid;
  gap: 4px;
  padding: 8px 6px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 8px;
  background: #fbfdff;
  text-align: center;

  span {
    color: #64748b;
    font-size: 0.5rem;
    font-weight: 800;
    line-height: 1.15;
    text-transform: uppercase;
  }

  strong {
    color: ${({ $pending }) => ($pending ? "#f97316" : "#071e49")};
    font-size: 0.66rem;
    font-weight: 900;
    line-height: 1;
  }
`;
const MobileCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 3px;
`;
const MobileOutlineBtn = styled.button`
  height: 30px;
  min-width: 76px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid rgba(2, 84, 160, 0.24);
  border-radius: 8px;
  background: #ffffff;
  color: #0254a0;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 800;

  svg {
    width: 12px;
  }
`;
const Table = styled.table`
  width: 100%;
  min-width: 1540px;
  border-collapse: collapse;
  font-size: 0.7rem;
  th {
    padding: 14px 16px;
    text-align: center;
    color: #26395d;
    font-weight: 800;
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0;
    background: #fbfdff;
    border-bottom: 1px solid rgba(13, 34, 68, 0.09);
    white-space: nowrap;
  }
  td {
    padding: 13px 16px;
    color: #0d2244;
    border-bottom: 1px solid rgba(13, 34, 68, 0.08);
    vertical-align: middle;
    white-space: nowrap;
    font-weight: 600;
  }
  tr:last-child td {
    border-bottom: 0;
  }
  tr:hover td {
    background: #f9fbff;
  }
`;
const ClickableRow = styled.tr`
  cursor: pointer;
  &:focus-visible td {
    outline: 2px solid #0254a0;
    outline-offset: -2px;
  }
`;
const DesktopClientCell = styled.div`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 11px;
  min-width: 0;
`;
const DesktopClientAvatar = styled.span`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: ${({ $bg }) => $bg || "#0d2244"};
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 900;
`;
const DesktopClientName = styled.span`
  display: block;
  max-width: 620px;
  overflow: hidden;
  color: #0d2244;
  font-weight: 900;
  white-space: normal;
`;
const DesktopMutedCell = styled.span`
  display: block;
  max-width: ${({ $width }) => $width || "180px"};
  overflow: hidden;
  color: #26395d;
  text-overflow: ellipsis;
`;
const DesktopEmail = styled(DesktopMutedCell)`
  color: #0b66d8;
`;
const DesktopPayment = styled.span`
  display: block;
  text-align: center;
  color: ${({ $pending }) => ($pending ? "#f97316" : "#15803d")};
  font-size: 0.76rem;
  font-weight: 900;
`;
const DesktopCountValue = styled.span`
  display: block;
  text-align: center;
  color: #0d2244;
  font-size: 0.76rem;
  font-weight: 900;
`;
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.58rem;
  font-weight: 900;
  background: ${({ $status }) =>
    ({
      Active: "#ecfdf3",
      Inactive: "#f3f4f6",
      Prospect: "#fffbeb",
      Closed: "#fef2f2",
      Completed: "#ecfdf3",
      Pending: "#fffbeb",
      "In Progress": "#eaf3fb",
      "Waiting for Client": "#fef3c7",
    })[$status] || "#f3f4f6"};
  color: ${({ $status }) =>
    ({
      Active: "#087443",
      Inactive: "#374151",
      Prospect: "#b45309",
      Closed: "#b42318",
      Completed: "#087443",
      Pending: "#b45309",
      "In Progress": "#0254a0",
      "Waiting for Client": "#92400e",
    })[$status] || "#374151"};

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: currentColor;
  }
`;
const Empty = styled.div`
  padding: 38px 18px;
  text-align: center;
  color: #33425e;
  p {
    margin: 0 0 12px;
    font-size: 0.8rem;
  }
`;
const Skeleton = styled.div`
  height: 16px;
  width: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f4f8 25%, #e8eef5 50%, #f0f4f8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 8000;
  background: rgba(11, 31, 60, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  animation: ${fadeIn} 0.2s ease;
`;
const Modal = styled.form`
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 24px 70px rgba(11, 31, 60, 0.2);
  animation: ${fadeIn} 0.24s ease;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(13, 34, 68, 0.1);
  h3 {
    margin: 0;
    color: #0d2244;
    font-size: 0.95rem;
  }
  button {
    background: none;
    border: 0;
    cursor: pointer;
    color: #33425e;
    font-size: 18px;
  }
`;
const ModalBody = styled.div`
  padding: 18px 20px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.label`
  display: grid;
  gap: 6px;
  color: #0d2244;
  font-size: 0.74rem;
  font-weight: 700;
  input,
  select,
  textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(13, 34, 68, 0.16);
    border-radius: 7px;
    padding: 0 10px;
    font: inherit;
    font-size: 0.78rem;
    color: #26395d;
    outline: none;
  }
  input,
  select {
    height: 36px;
  }
  textarea {
    min-height: 72px;
    padding-top: 9px;
    resize: vertical;
  }
  input:focus,
  select:focus,
  textarea:focus {
    border-color: #0254a0;
  }
`;
const FullField = styled(Field)`
  grid-column: 1/-1;
`;
const ModalActions = styled.div`
  grid-column: 1/-1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;
const DetailShell = styled.div`
  display: grid;
  gap: 14px;

  @media (max-width: 768px) {
    gap: 14px;
    color: #071e49;
  }
`;
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #0254a0;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;

  @media (max-width: 768px) {
    color: #0058d8;
    font-size: 0.9rem;
    font-weight: 800;
    width: max-content;

    svg {
      width: 14px;
    }
  }
`;
const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px solid rgba(13, 34, 68, 0.1);

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    margin-top: 16px;
    border-bottom-color: rgba(13, 34, 68, 0.14);
  }
`;
const TabButton = styled.button`
  height: 36px;
  padding: 0 12px;
  border: 0;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#0254a0" : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? "#0254a0" : "#33425e")};
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 46px;
    padding: 0 3px;
    color: ${({ $active }) => ($active ? "#0058d8" : "#33425e")};
    border-bottom-width: 2px;
    border-bottom-color: ${({ $active }) => ($active ? "#0058d8" : "transparent")};
    font-size: 0.62rem;
    font-weight: 800;
    white-space: nowrap;
  }
`;
const Panel = styled.div`
  background: #fff;
  border: 1px solid rgba(13, 34, 68, 0.07);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(11, 31, 60, 0.06);
  padding: 16px;

  @media (max-width: 768px) {
    border: 1px solid rgba(13, 34, 68, 0.1);
    border-radius: 13px;
    box-shadow: 0 8px 24px rgba(11, 31, 60, 0.05);
    padding: 25px 18px 20px;
  }
`;
const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 18px;
  }

  @media (max-width: 360px) {
    gap: 12px 14px;
  }
`;
const InfoItem = styled.div`
  display: grid;
  gap: 4px;
  font-size: 0.78rem;
  grid-column: ${({ $full }) => ($full ? "1 / -1" : "auto")};
  padding: ${({ $note }) => ($note ? "18px" : "0")};
  border-radius: ${({ $note }) => ($note ? "10px" : "0")};
  background: ${({ $note }) => ($note ? "#f6fbff" : "transparent")};

  strong {
    color: #33425e;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  span {
    color: #0d2244;
  }

  @media (max-width: 768px) {
    gap: 3px;
    color: #071e49;
    font-size: 0.62rem;
    line-height: 1.52;
    overflow-wrap: anywhere;

    strong {
      color: #33425e;
      font-size: 0.62rem;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    span {
      color: #071e49;
    }

    ${({ $note }) =>
      $note
        ? `
          margin-top: 2px;
          padding: 12px 14px;
          border-radius: 10px;
          background: #f6fbff;
          line-height: 1.6;
        `
        : ""}
  }
`;
const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 10px;
  }
`;
const OptionCard = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 76px;
  padding: 12px;
  border: 1px solid rgba(13, 34, 68, 0.12);
  border-radius: 8px;
  background: #fff;
  color: #0d2244;
  text-align: left;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  &:hover {
    border-color: #0254a0;
    background: #f6fbff;
  }
  svg {
    width: 18px;
    color: #0254a0;
    flex: 0 0 auto;
  }

  @media (max-width: 768px) {
    min-height: 86px;
    padding: 11px;
    gap: 10px;
    border-color: rgba(13, 34, 68, 0.1);
    border-radius: 13px;
    box-shadow: 0 8px 24px rgba(11, 31, 60, 0.06);
    font-size: 0.68rem;
    line-height: 1.25;

    ${({ $active }) =>
      $active
        ? `
          border-color: #0058d8;
          box-shadow: 0 8px 24px rgba(2, 84, 160, 0.1);
        `
        : ""}

    &:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }

    svg {
      width: 20px;
      height: 20px;
      padding: 10px;
      border-radius: 12px;
      background: #f1f6fd;
      box-shadow: inset 0 0 0 1px rgba(2, 84, 160, 0.05);
      color: #0058d8;
      flex: 0 0 auto;
      box-sizing: content-box;
    }

    span {
      color: #071e49;
      font-weight: 800;
      text-align: left;
    }
  }
`;
const DesktopTaskTableWrap = styled(TableWrap)`
  @media (max-width: 768px) {
    display: none;
  }
`;
const MobileServiceTasks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: grid;
    gap: 10px;
  }
`;
const MobileTaskCard = styled.article`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 10px;
  padding: 10px 12px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(11, 31, 60, 0.06);
`;
const MobileTaskMetric = styled.button`
  min-width: 0;
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  gap: 7px;
  align-items: center;
  padding: 8px 0;
  border: 0;
  border-bottom: 1px solid rgba(13, 34, 68, 0.08);
  background: transparent;
  color: #071e49;
  text-align: left;
  font: inherit;

  &:nth-last-child(-n + 2) {
    border-bottom: 0;
  }

  svg {
    width: 12px;
    height: 12px;
    padding: 7px;
    border-radius: 8px;
    background: #f1f6fd;
    color: #0058d8;
    box-sizing: content-box;
  }

  span {
    display: block;
    color: #64748b;
    font-size: 0.54rem;
    line-height: 1.2;
  }

  strong {
    display: block;
    min-width: 0;
    margin-top: 2px;
    color: #071e49;
    font-size: 0.6rem;
    line-height: 1.28;
    overflow-wrap: anywhere;
  }

  ${Badge} {
    margin-top: 2px;
    padding: 2px 7px;
    font-size: 0.56rem;
  }
`;
const MobileBillingSummaryGrid = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 10px;
  }
`;
const MobileBillingCard = styled.button`
  min-height: 88px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 14px;
  border: 1px solid ${({ $active }) => ($active ? "#0058d8" : "rgba(13, 34, 68, 0.1)")};
  border-radius: 12px;
  background: #fff;
  color: #071e49;
  text-align: left;
  font: inherit;
  box-shadow: 0 8px 22px rgba(11, 31, 60, 0.05);

  svg {
    width: 17px;
    height: 17px;
    padding: 12px;
    border-radius: 10px;
    background: #f1f6fd;
    color: #0058d8;
    box-sizing: content-box;
  }

  span {
    display: block;
    color: #071e49;
    font-size: 0.72rem;
    font-weight: 800;
    line-height: 1.18;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #071e49;
    font-size: 1rem;
    line-height: 1;
  }
`;
const DesktopBillingOptions = styled(OptionGrid)`
  @media (max-width: 768px) {
    display: none;
  }
`;
const MobileBillingRows = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: grid;
    gap: 10px;
  }
`;
const MobileInvoiceCard = styled.article`
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(11, 31, 60, 0.05);
`;
const MobileInvoiceHead = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 10px;
  align-items: center;

  svg {
    width: 16px;
    height: 16px;
    padding: 11px;
    border-radius: 10px;
    background: #f1f6fd;
    color: #0058d8;
    box-sizing: content-box;
  }

  h4 {
    margin: 0 0 3px;
    color: #071e49;
    font-size: 0.78rem;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #33425e;
    font-size: 0.62rem;
  }
`;
const MobileInvoiceMeta = styled.div`
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(13, 34, 68, 0.08);
`;
const MobileInvoiceLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(13, 34, 68, 0.08);
  color: #33425e;
  font-size: 0.66rem;

  &:last-child {
    border-bottom: 0;
  }

  strong {
    color: #071e49;
    font-weight: 800;
    text-align: right;
  }
`;
const MobileFullBtn = styled(PrimaryBtn)`
  @media (max-width: 768px) {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    font-size: 0.78rem;
  }
`;
const ServicePanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 16px 0 10px;
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
const TaskTable = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  font-size: 0.76rem;
  th,
  td {
    padding: 9px 10px;
    border-bottom: 1px solid rgba(13, 34, 68, 0.07);
    text-align: left;
    vertical-align: top;
  }
  th {
    color: #33425e;
    font-size: 0.64rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: #f6fbff;
  }
  td {
    color: #0d2244;
  }
`;
const TaskRow = styled.tr`
  cursor: pointer;

  &:hover td {
    background: #f9fbff;
  }
`;
const HistoryBody = styled.div`
  padding: 18px 20px;
  display: grid;
  gap: 14px;
`;
const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
const HistoryItem = styled.div`
  padding: 9px 10px;
  border: 1px solid rgba(13, 34, 68, 0.08);
  border-radius: 8px;
  background: #f9fbff;
  font-size: 0.76rem;

  strong {
    display: block;
    margin-bottom: 3px;
    color: #33425e;
    font-size: 0.64rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;
const EmptyState = styled.div`
  padding: 22px 14px;
  border: 1px dashed rgba(13, 34, 68, 0.18);
  border-radius: 8px;
  text-align: center;
  color: #33425e;
  font-size: 0.78rem;
`;
const Hint = styled.p`
  color: #5f6f89;
  font-size: 0.72rem;
  line-height: 1.5;
`;
const CompactGroup = styled.div`
  display: grid;
  gap: 8px;

  h4 {
    margin: 0;
    color: #0d2244;
    font-size: 0.76rem;
    font-weight: 800;
  }
`;
const CompactCheckGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const CompactCheck = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 7px 9px;
  border: 1px solid ${({ $checked }) => ($checked ? "rgba(2,84,160,.32)" : "rgba(13,34,68,.1)")};
  border-radius: 7px;
  background: ${({ $checked }) => ($checked ? "#f6fbff" : "#fff")};
  color: #0d2244;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;

  input {
    width: 14px;
    height: 14px;
    margin: 0;
    flex: 0 0 auto;
  }

  svg {
    width: 14px;
    color: #0254a0;
    flex: 0 0 auto;
  }
`;
const TextAction = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  color: #0254a0;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
`;
const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
`;
const IconAction = styled.button`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(180, 35, 24, 0.22);
  border-radius: 7px;
  background: #fff;
  color: #b42318;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #fef2f2;
    border-color: rgba(180, 35, 24, 0.42);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const initialForm = {
  name: "",
  companyName: "",
  clientType: "Individual",
  contactPerson: "",
  email: "",
  phone: "",
  pan: "",
  gstin: "",
  address: "",
  service: "",
  status: "Active",
  notes: "",
};

const complianceOptions = [
  { label: "GST Return", icon: faFileCircleCheck },
  { label: "GST Reconciliation", icon: faScaleBalanced },
  { label: "TDS Return - Q2", icon: faClipboardCheck },
  { label: "ITR Filing", icon: faFileInvoice },
  { label: "PF & ESI Return", icon: faClipboardCheck },
  { label: "PT Return", icon: faClipboardCheck },
  { label: "ROC Annual Filing", icon: faBuildingColumns },
];

const noticeOptions = [
  { label: "GST Notice", icon: faBell },
  { label: "Income Tax Notice", icon: faTriangleExclamation },
  { label: "TDS Notice", icon: faReceipt },
  { label: "PF Notices", icon: faClipboardCheck },
  { label: "ESI Notices", icon: faClipboardCheck },
  { label: "PT Notices", icon: faClipboardCheck },
  { label: "Other Notice", icon: faClipboardCheck },
];

const billingOptions = [
  { key: "INVOICE_TO_BE_RAISED", label: "Invoices to be Raised", icon: faReceipt },
  { key: "INVOICE_RAISED", label: "Invoices Raised", icon: faFileInvoiceDollar },
  { key: "PAYMENT_PENDING", label: "Payments Pending", icon: faMoneyBillWave },
  { key: "PAID", label: "Payments History", icon: faCreditCard },
];

const initialTaskForm = {
  description: "",
  dueDate: "",
  assignedTo: "",
  workStatus: "Pending",
  workPreference: "Medium",
  comment: "",
  recurrenceFrequency: "NONE",
};

const initialInvoiceForm = {
  amount: "",
  invoiceNumber: "",
};

const invoiceServiceOptions = [
  ...complianceOptions.map((item) => ({ service: item.label, taskType: "Compliance", icon: item.icon })),
  ...noticeOptions.map((item) => ({ service: item.label, taskType: "Notice", icon: item.icon })),
];

const initialPaymentForm = {
  amount: "",
  note: "",
};

const ROLE_LEVELS = {
  INTERN: 0,
  ARTICLE_ASSISTANT: 0,
  PAID_ASSISTANT: 0,
  EMPLOYEE: 0,
  ACCOUNTS_AND_AUDIT_EXECUTIVE: 1,
  ACCOUNTANT: 1,
  SENIOR_ACCOUNTANT: 2,
  MANAGER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

const canAssignTaskTo = (actor, target) => {
  if (!actor || !target) return false;
  if (target.status !== "Active") return false;
  if (String(actor.id) === String(target.id)) return actor.role === "ADMIN";
  if (target.role === "SUPER_ADMIN") return false;
  if (actor.role === "SUPER_ADMIN") return true;
  if (actor.role === "ADMIN") {
    return ROLE_LEVELS[actor.role] > ROLE_LEVELS[target.role];
  }
  return false;
};

const formatDate = (value) => (value ? String(value).slice(0, 10) : "-");
const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN") : "-";
const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
const clientInitials = (client) =>
  (client.companyName || client.name || "C")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C";
const avatarColors = ["#0d2244", "#0058d8", "#f97316", "#087443", "#7c3aed"];
const normalizeText = (value) => String(value || "").trim().toLowerCase();
const normalizeServiceKey = (value) => normalizeText(value).replace(/[^a-z0-9]/g, "");
const taskMetricRows = (task) => {
  const lastComment = task.comments?.length ? task.comments[task.comments.length - 1] : null;
  return [
    { label: "Service", value: task.service || "-", icon: faFileLines },
    { label: "Assigned Date", value: formatDate(task.createdAt), icon: faCalendarDays },
    { label: "Due Date", value: formatDate(task.dueDate), icon: faCalendarDays },
    {
      label: "Assigned To",
      value: task.needsReassignment
        ? "Reassign"
        : task.assignedTo?.name || task.assignedTo?.email || "-",
      icon: faUserTie,
      reassign: task.needsReassignment,
    },
    { label: "Status", value: task.workStatus || "-", icon: faClock, badge: true },
    { label: "Preference", value: task.workPreference || "-", icon: faUserCheck },
    { label: "Description", value: task.description || "-", icon: faFileLines },
    { label: "Last Comment", value: lastComment?.text || "-", icon: faCommentDots },
  ];
};

function ClientDetail({ canEditClient }) {
  const { admin } = useAuth();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [clientTasks, setClientTasks] = useState([]);
  const [billingItems, setBillingItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [invoiceForm, setInvoiceForm] = useState(initialInvoiceForm);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [savingBilling, setSavingBilling] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedComplianceService, setSelectedComplianceService] = useState(
    null,
  );
  const [selectedNoticeService, setSelectedNoticeService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState("Compliance");
  const [selectedTaskHistory, setSelectedTaskHistory] = useState(null);
  const [reassignTask, setReassignTask] = useState(null);
  const [reassignTo, setReassignTo] = useState("");
  const [selectedBillingStatus, setSelectedBillingStatus] = useState(
    "INVOICE_TO_BE_RAISED",
  );
  const [invoiceItem, setInvoiceItem] = useState(null);
  const [groupedInvoice, setGroupedInvoice] = useState(null);
  const [billingServicePickerOpen, setBillingServicePickerOpen] = useState(false);
  const [selectedInvoiceServices, setSelectedInvoiceServices] = useState([]);
  const [selectedInvoiceItemIds, setSelectedInvoiceItemIds] = useState([]);
  const [paymentItem, setPaymentItem] = useState(null);
  const [deleteInvoiceItem, setDeleteInvoiceItem] = useState(null);

  const loadClient = useCallback(async () => {
    setLoading(true);
    const res = await api.get(`/clients/${id}`);
    if (res.success) {
      setClient(res.client);
      setForm({ ...initialForm, ...res.client });
    } else {
      toast.error(res.message || "Unable to load client");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadClient();
  }, [loadClient]);

  const loadBillingItems = useCallback(async () => {
    const res = await api.get(`/billing?client=${id}`);
    if (res.success) setBillingItems(res.billingItems || []);
  }, [id]);

  useEffect(() => {
    loadBillingItems();
  }, [loadBillingItems]);

  const loadClientTasks = useCallback(async () => {
    const res = await api.get(`/tasks?client=${id}`);
    if (res.success) {
      setClientTasks(res.tasks || []);
      loadBillingItems();
    }
  }, [id, loadBillingItems]);

  useEffect(() => {
    loadClientTasks();
  }, [loadClientTasks]);

  useEffect(() => {
    api.get("/users").then((res) => {
      if (res.success) setEmployees(res.users || []);
    });
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    const res = await api.patch(`/clients/${id}`, form);
    setSaving(false);
    if (res.success) {
      setClient(res.client);
      setForm({ ...initialForm, ...res.client });
      setEditingProfile(false);
      toast.success("Client profile updated");
    } else {
      toast.error(res.message || "Unable to update client");
    }
  };

  const openTaskForm = (service, taskType = "Compliance") => {
    setSelectedService(service);
    setSelectedTaskType(taskType);
    setTaskForm(initialTaskForm);
  };

  const createComplianceTask = async (event) => {
    event.preventDefault();
    setSavingTask(true);
    const res = await api.post("/tasks", {
      ...taskForm,
      recurringMonthly: taskForm.recurrenceFrequency === "MONTHLY",
      client: id,
      service: selectedService,
      taskType: selectedTaskType,
    });
    setSavingTask(false);
    if (res.success) {
      toast.success(`${selectedService} task assigned`);
      setSelectedService(null);
      setTaskForm(initialTaskForm);
      if (selectedTaskType === "Notice") {
        setSelectedNoticeService(selectedService);
      } else {
        setSelectedComplianceService(selectedService);
      }
      loadClientTasks();
      loadBillingItems();
    } else {
      toast.error(res.message || "Unable to assign task");
    }
  };

  const openReassignTask = (task) => {
    setReassignTask(task);
    setReassignTo("");
  };

  const submitReassignTask = async (event) => {
    event.preventDefault();
    if (!reassignTask || !reassignTo) {
      toast.error("Select an active employee");
      return;
    }
    setSavingTask(true);
    const res = await api.patch(`/tasks/${reassignTask.id}/reassign`, {
      assignedTo: reassignTo,
    });
    setSavingTask(false);
    if (res.success) {
      toast.success("Task reassigned");
      setReassignTask(null);
      setReassignTo("");
      loadClientTasks();
    } else {
      toast.error(res.message || "Unable to reassign task");
    }
  };

  const openInvoiceForm = (item) => {
    setInvoiceItem(item);
    setInvoiceForm({
      amount: item.amount || "",
      invoiceNumber: item.invoiceNumber || "",
    });
  };

  const openBulkInvoiceForm = () => {
    const items = selectedBillingItems.filter((item) => selectedInvoiceItemIds.includes(item.id));
    if (items.length === 0) {
      toast.error("Select at least one invoice item");
      return;
    }
    setInvoiceItem({ bulk: true, items, service: `${items.length} selected services` });
    setInvoiceForm(initialInvoiceForm);
  };

  const raiseInvoice = async (event) => {
    event.preventDefault();
    setSavingBilling(true);
    const res = invoiceItem.bulk
      ? await api.patch("/billing/raise-invoices", {
          ...invoiceForm,
          itemIds: invoiceItem.items.map((item) => item.id),
        })
      : await api.patch(`/billing/${invoiceItem.id}/raise-invoice`, invoiceForm);
    setSavingBilling(false);
    if (res.success) {
      toast.success(invoiceItem.bulk ? "Invoices raised" : "Invoice raised");
      setInvoiceItem(null);
      setInvoiceForm(initialInvoiceForm);
      setSelectedInvoiceItemIds([]);
      setSelectedBillingStatus("INVOICE_RAISED");
      loadBillingItems();
    } else {
      toast.error(res.message || "Unable to raise invoice");
    }
  };

  const toggleInvoiceService = (service) => {
    setSelectedInvoiceServices((current) =>
      current.some((item) => item.service === service.service && item.taskType === service.taskType)
        ? current.filter((item) => !(item.service === service.service && item.taskType === service.taskType))
        : [...current, service],
    );
  };

  const createInvoiceItems = async (event) => {
    event.preventDefault();
    if (selectedInvoiceServices.length === 0) {
      toast.error("Select at least one compliance or notice");
      return;
    }
    setSavingBilling(true);
    const res = await api.post("/billing", {
      client: id,
      services: selectedInvoiceServices,
    });
    setSavingBilling(false);
    if (res.success) {
      toast.success("Invoice items created");
      setBillingServicePickerOpen(false);
      setSelectedInvoiceServices([]);
      setSelectedBillingStatus("INVOICE_TO_BE_RAISED");
      loadBillingItems();
    } else {
      toast.error(res.message || "Unable to create invoice items");
    }
  };

  const toggleInvoiceItem = (itemId) => {
    setSelectedInvoiceItemIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  };

  const markPaymentPending = async (item) => {
    setSavingBilling(true);
    const res = await api.patch(`/billing/${item.id}/payment-pending`, {});
    setSavingBilling(false);
    if (res.success) {
      toast.success("Moved to payment pending");
      setSelectedBillingStatus("PAYMENT_PENDING");
      loadBillingItems();
    } else {
      toast.error(res.message || "Unable to update payment status");
    }
  };

  const openPaymentForm = (item) => {
    setPaymentItem(item);
    setPaymentForm({
      amount: item.balanceAmount || "",
      note: "",
    });
  };

  const recordPayment = async (event) => {
    event.preventDefault();
    setSavingBilling(true);
    const res = await api.patch(`/billing/${paymentItem.id}/paid`, paymentForm);
    setSavingBilling(false);
    if (res.success) {
      toast.success("Payment recorded");
      setPaymentItem(null);
      setPaymentForm(initialPaymentForm);
      setSelectedBillingStatus(res.billingItem?.status === "PAID" ? "PAID" : "PAYMENT_PENDING");
      loadBillingItems();
    } else {
      toast.error(res.message || "Unable to record payment");
    }
  };

  const deleteRaisedInvoice = async () => {
    if (!deleteInvoiceItem) return;
    setSavingBilling(true);
    const res = await api.delete(`/billing/${deleteInvoiceItem.id}/invoice`);
    setSavingBilling(false);
    if (res.success) {
      toast.success("Invoice and related payments deleted");
      setDeleteInvoiceItem(null);
      setSelectedInvoiceItemIds([]);
      setSelectedBillingStatus("INVOICE_TO_BE_RAISED");
      loadBillingItems();
    } else {
      toast.error(res.message || "Unable to delete invoice");
    }
  };

  const taskMatchesService = (task, service, taskType) => {
    const sameService = normalizeServiceKey(task.service) === normalizeServiceKey(service);
    if (!sameService) return false;
    const normalizedTaskType = normalizeText(task.taskType || "Compliance");
    return taskType === "Notice"
      ? normalizedTaskType === "notice"
      : normalizedTaskType !== "notice";
  };
  const serviceTaskRows = (service, taskType = "Compliance") => {
    if (!service) return [];
    const rowsById = new Map();

    clientTasks
      .filter((task) => taskMatchesService(task, service, taskType))
      .forEach((task) => rowsById.set(String(task.id), task));

    billingItems
      .filter((item) => taskMatchesService(item, service, taskType))
      .forEach((item) => {
        const taskId = item.task?.id || item.id;
        if (rowsById.has(String(taskId))) return;
        rowsById.set(String(taskId), {
          id: taskId,
          service: item.task?.service || item.service,
          taskType: item.taskType || taskType,
          createdAt: item.createdAt,
          dueDate: "",
          assignedTo: null,
          workStatus: item.task?.workStatus || "Completed",
          workPreference: "-",
          description: item.service || "-",
          comments: [],
          updatedAt: item.task?.completedAt || item.updatedAt,
        });
      });

    return Array.from(rowsById.values()).sort(
      (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0),
    );
  };
  const selectedServiceTasks = serviceTaskRows(selectedComplianceService, "Compliance");
  const selectedNoticeTasks = serviceTaskRows(selectedNoticeService, "Notice");
  const assignableEmployees = employees.filter((employee) =>
    canAssignTaskTo(admin, employee),
  );
  const billingCounts = billingOptions.reduce(
    (counts, option) => ({
      ...counts,
      [option.key]:
        option.key === "PAID"
          ? billingItems.reduce((sum, item) => sum + (item.payments || []).length, 0)
          : billingItems.filter((item) =>
              option.key === "INVOICE_RAISED"
                ? Boolean(item.invoiceRaisedAt)
                : item.status === option.key,
            ).length,
    }),
    {},
  );
  const selectedBillingItems = billingItems.filter((item) =>
    selectedBillingStatus === "PAID"
      ? Number(item.paidAmount || 0) > 0
      : selectedBillingStatus === "INVOICE_RAISED"
        ? Boolean(item.invoiceRaisedAt)
      : item.status === selectedBillingStatus,
  );
  const selectedBillingOption = billingOptions.find(
    (item) => item.key === selectedBillingStatus,
  );
  const showingPaymentHistory = selectedBillingStatus === "PAID";
  const showingInvoicesRaised = selectedBillingStatus === "INVOICE_RAISED";
  const paymentHistoryRows = billingItems
    .flatMap((item) =>
      (item.payments || []).map((payment) => ({
        ...item,
        id: `${item.id}-${payment._id || payment.receivedAt}`,
        sourceInvoice: item,
        paidAmount: Number(payment.amount || 0),
        paymentNote: payment.note || "",
        paidAt: payment.receivedAt,
        balanceAmount: Math.max(Number(item.amount || 0) - Number(item.paidAmount || 0), 0),
      })),
    )
    .sort((a, b) => new Date(b.paidAt || 0) - new Date(a.paidAt || 0));
  const visibleBillingRows = showingPaymentHistory ? paymentHistoryRows : selectedBillingItems;
  const taskHistoryRows = selectedTaskHistory
    ? [
        {
          date: selectedTaskHistory.createdAt,
          action: "Task Assigned",
          status: selectedTaskHistory.workStatus,
          by:
            selectedTaskHistory.assignedBy?.name ||
            selectedTaskHistory.assignedBy?.email ||
            "-",
          comment: selectedTaskHistory.description || "-",
        },
        ...(selectedTaskHistory.comments || []).map((comment, index) => ({
          date: comment.createdAt,
          action: index === 0 ? "Initial Comment" : "Status Updated",
          status: comment.status || "-",
          by: comment.authorName || "-",
          comment: comment.text || "-",
        })),
      ]
    : [];

  if (loading) {
    return (
      <DetailShell>
        <BackLink to="/admin/clients">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to clients
        </BackLink>
        <Panel>
          <Skeleton />
        </Panel>
      </DetailShell>
    );
  }

  if (!client) {
    return (
      <DetailShell>
        <BackLink to="/admin/clients">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to clients
        </BackLink>
        <Empty>
          <p>Client not found</p>
        </Empty>
      </DetailShell>
    );
  }

  return (
    <DetailShell>
      <BackLink to="/admin/clients">
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to clients
      </BackLink>
      <PageHeader>
        <div>
          <h2>{client.companyName || client.name}</h2>
          <p>
            {client.name || "-"} {client.phone ? ` | ${client.phone}` : ""}
          </p>
        </div>
        <Badge $status={client.status}>{client.status}</Badge>
      </PageHeader>

      <Tabs>
        {[
          ["profile", "Client Profile"],
          ["compliance", "Compliance"],
          ["notices", "Notices"],
          ["billing", "Billing & Payments"],
        ].map(([key, label]) => (
          <TabButton
            key={key}
            $active={activeTab === key}
            type="button"
            onClick={() => setActiveTab(key)}
          >
            {label}
          </TabButton>
        ))}
      </Tabs>

      {activeTab === "profile" && (
        <Panel>
          {editingProfile ? (
            <form onSubmit={saveProfile}>
              <ProfileGrid>
                <Field>
                  Name
                  <input
                    required
                    placeholder="Rahul Mehta"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
                <Field>
                  Company Name
                  <input
                    placeholder="Mehta Traders Pvt Ltd"
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({ ...form, companyName: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  Phone Number
                  <input
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  Email
                  <input
                    type="email"
                    placeholder="rahul.mehta@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  PAN Number
                  <input
                    placeholder="ABCDE1234F"
                    value={form.pan}
                    onChange={(e) =>
                      setForm({ ...form, pan: e.target.value.toUpperCase() })
                    }
                  />
                </Field>
                <Field>
                  GST Number
                  <input
                    placeholder="07ABCDE1234F1Z5"
                    value={form.gstin}
                    onChange={(e) =>
                      setForm({ ...form, gstin: e.target.value.toUpperCase() })
                    }
                  />
                </Field>
                <Field>
                  Client Type
                  <select
                    value={form.clientType}
                    onChange={(e) =>
                      setForm({ ...form, clientType: e.target.value })
                    }
                  >
                    {[
                      "Individual",
                      "Proprietorship",
                      "Partnership",
                      "LLP",
                      "Company",
                      "Trust",
                      "Other",
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
                <Field>
                  Service
                  <input
                    placeholder="GST, Income Tax, Audit..."
                    value={form.service}
                    onChange={(e) =>
                      setForm({ ...form, service: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  Status
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    {["Active", "Inactive", "Prospect", "Closed"].map(
                      (item) => (
                        <option key={item}>{item}</option>
                      ),
                    )}
                  </select>
                </Field>
                <Field>
                  Contact Person
                  <input
                    placeholder="Priya Mehta"
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm({ ...form, contactPerson: e.target.value })
                    }
                  />
                </Field>
                <FullField>
                  Address
                  <textarea
                    placeholder="123 MG Road, Connaught Place, New Delhi"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </FullField>
                <FullField>
                  Notes
                  <textarea
                    placeholder="Monthly GST filing and annual income tax return"
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </FullField>
              </ProfileGrid>
              <ModalActions>
                <SecondaryBtn
                  type="button"
                  onClick={() => {
                    setForm({ ...initialForm, ...client });
                    setEditingProfile(false);
                  }}
                >
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn disabled={saving} type="submit">
                  {saving ? "Saving..." : "Save Changes"}
                </PrimaryBtn>
              </ModalActions>
            </form>
          ) : (
            <>
              <ProfileGrid>
                {[
                  ["Name", client.name],
                  ["Company", client.companyName],
                  ["Phone", client.phone],
                  ["Email", client.email],
                  ["PAN", client.pan],
                  ["GST", client.gstin],
                  ["Client Type", client.clientType],
                  ["Service", client.service],
                  ["Contact Person", client.contactPerson],
                  ["Address", client.address],
                  ["Notes", client.notes],
                ].map(([label, value]) => (
                  <InfoItem
                    key={label}
                    $full={label === "Notes"}
                    $note={label === "Notes"}
                  >
                    <strong>{label}</strong>
                    <span>{value || "-"}</span>
                  </InfoItem>
                ))}
              </ProfileGrid>
              {canEditClient && (
                <ModalActions>
                  <ProfileEditBtn
                    type="button"
                    onClick={() => setEditingProfile(true)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                    Edit Profile
                  </ProfileEditBtn>
                </ModalActions>
              )}
            </>
          )}
        </Panel>
      )}

      {activeTab === "compliance" && (
        <Panel>
          <OptionGrid>
            {complianceOptions.map((item) => (
              <OptionCard
                key={item.label}
                $active={selectedComplianceService === item.label}
                type="button"
                onClick={() => setSelectedComplianceService(item.label)}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </OptionCard>
            ))}
          </OptionGrid>
          {selectedComplianceService && (
            <>
              <ServicePanelHeader>
                <div>
                  <h3>{selectedComplianceService}</h3>
                  <p>
                    Assigned task rows for this client service, including due
                    date, employee and current status.
                  </p>
                </div>
                <PrimaryBtn
                  type="button"
                  onClick={() => openTaskForm(selectedComplianceService)}
                >
                  + Assign Task
                </PrimaryBtn>
              </ServicePanelHeader>
              {selectedServiceTasks.length === 0 ? (
                <EmptyState>
                  No task is assigned for {selectedComplianceService}. Assign
                  the task to start tracking this service.
                  <div style={{ marginTop: 10 }}>
                    <PrimaryBtn
                      type="button"
                      onClick={() => openTaskForm(selectedComplianceService)}
                    >
                      Assign Task
                    </PrimaryBtn>
                  </div>
                </EmptyState>
              ) : (
                <>
                <MobileServiceTasks>
                  {selectedServiceTasks.map((task) => (
                    <MobileTaskCard key={`mobile-${task.id}`}>
                      {taskMetricRows(task).map((row) => (
                        <MobileTaskMetric
                          key={`${task.id}-${row.label}`}
                          type="button"
                          onClick={(event) => {
                            if (row.reassign) {
                              event.stopPropagation();
                              openReassignTask(task);
                            } else {
                              setSelectedTaskHistory(task);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={row.icon} />
                          <div>
                            <span>{row.label}</span>
                            {row.badge ? (
                              <Badge $status={row.value}>{row.value}</Badge>
                            ) : (
                              <strong>{row.value}</strong>
                            )}
                          </div>
                        </MobileTaskMetric>
                      ))}
                    </MobileTaskCard>
                  ))}
                </MobileServiceTasks>
                <DesktopTaskTableWrap>
                  <TaskTable>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Assigned Date</th>
                        <th>Due Date</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Preference</th>
                        <th>Description</th>
                        <th>Last Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedServiceTasks.map((task) => {
                        const lastComment = task.comments?.length
                          ? task.comments[task.comments.length - 1]
                          : null;
                        return (
                          <TaskRow
                            key={task.id}
                            onClick={() => setSelectedTaskHistory(task)}
                            title="View task history"
                          >
                            <td style={{ fontWeight: 700 }}>{task.service}</td>
                            <td>
                              {task.createdAt
                                ? String(task.createdAt).slice(0, 10)
                                : "-"}
                            </td>
                            <td>
                              {task.dueDate
                                ? String(task.dueDate).slice(0, 10)
                                : "-"}
                            </td>
                            <td>
                              {task.needsReassignment ? (
                                <SecondaryBtn
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openReassignTask(task);
                                  }}
                                >
                                  Reassign
                                </SecondaryBtn>
                              ) : (
                                task.assignedTo?.name ||
                                  task.assignedTo?.email ||
                                  "-"
                              )}
                            </td>
                            <td>
                              <Badge $status={task.workStatus}>
                                {task.workStatus}
                              </Badge>
                            </td>
                            <td>{task.workPreference || "-"}</td>
                            <td>{task.description || "-"}</td>
                            <td>{lastComment?.text || "-"}</td>
                          </TaskRow>
                        );
                      })}
                    </tbody>
                  </TaskTable>
                </DesktopTaskTableWrap>
                </>
              )}
            </>
          )}
        </Panel>
      )}

      {activeTab === "notices" && (
        <Panel>
          <OptionGrid>
            {noticeOptions.map((item) => (
              <OptionCard
                key={item.label}
                $active={selectedNoticeService === item.label}
                type="button"
                onClick={() => setSelectedNoticeService(item.label)}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </OptionCard>
            ))}
          </OptionGrid>
          {selectedNoticeService && (
            <>
              <ServicePanelHeader>
                <div>
                  <h3>{selectedNoticeService}</h3>
                  <p>
                    Assigned notice tasks for this client, including assigned
                    date, due date, employee and current status.
                  </p>
                </div>
                <PrimaryBtn
                  type="button"
                  onClick={() => openTaskForm(selectedNoticeService, "Notice")}
                >
                  + Assign Task
                </PrimaryBtn>
              </ServicePanelHeader>
              {selectedNoticeTasks.length === 0 ? (
                <EmptyState>
                  No task is assigned for {selectedNoticeService}. Assign the
                  task to start tracking this notice.
                  <div style={{ marginTop: 10 }}>
                    <PrimaryBtn
                      type="button"
                      onClick={() =>
                        openTaskForm(selectedNoticeService, "Notice")
                      }
                    >
                      Assign Task
                    </PrimaryBtn>
                  </div>
                </EmptyState>
              ) : (
                <>
                <MobileServiceTasks>
                  {selectedNoticeTasks.map((task) => (
                    <MobileTaskCard key={`mobile-${task.id}`}>
                      {taskMetricRows(task).map((row) => (
                        <MobileTaskMetric
                          key={`${task.id}-${row.label}`}
                          type="button"
                          onClick={(event) => {
                            if (row.reassign) {
                              event.stopPropagation();
                              openReassignTask(task);
                            } else {
                              setSelectedTaskHistory(task);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={row.icon} />
                          <div>
                            <span>{row.label}</span>
                            {row.badge ? (
                              <Badge $status={row.value}>{row.value}</Badge>
                            ) : (
                              <strong>{row.value}</strong>
                            )}
                          </div>
                        </MobileTaskMetric>
                      ))}
                    </MobileTaskCard>
                  ))}
                </MobileServiceTasks>
                <DesktopTaskTableWrap>
                  <TaskTable>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Assigned Date</th>
                        <th>Due Date</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Preference</th>
                        <th>Description</th>
                        <th>Last Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedNoticeTasks.map((task) => {
                        const lastComment = task.comments?.length
                          ? task.comments[task.comments.length - 1]
                          : null;
                        return (
                          <TaskRow
                            key={task.id}
                            onClick={() => setSelectedTaskHistory(task)}
                            title="View task history"
                          >
                            <td style={{ fontWeight: 700 }}>{task.service}</td>
                            <td>
                              {task.createdAt
                                ? String(task.createdAt).slice(0, 10)
                                : "-"}
                            </td>
                            <td>
                              {task.dueDate
                                ? String(task.dueDate).slice(0, 10)
                                : "-"}
                            </td>
                            <td>
                              {task.needsReassignment ? (
                                <SecondaryBtn
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openReassignTask(task);
                                  }}
                                >
                                  Reassign
                                </SecondaryBtn>
                              ) : (
                                task.assignedTo?.name ||
                                  task.assignedTo?.email ||
                                  "-"
                              )}
                            </td>
                            <td>
                              <Badge $status={task.workStatus}>
                                {task.workStatus}
                              </Badge>
                            </td>
                            <td>{task.workPreference || "-"}</td>
                            <td>{task.description || "-"}</td>
                            <td>{lastComment?.text || "-"}</td>
                          </TaskRow>
                        );
                      })}
                    </tbody>
                  </TaskTable>
                </DesktopTaskTableWrap>
                </>
              )}
            </>
          )}
        </Panel>
      )}

      {activeTab === "billing" && (
        <Panel>
          <MobileBillingSummaryGrid>
            {billingOptions.map((item) => (
              <MobileBillingCard
                key={item.key}
                $active={selectedBillingStatus === item.key}
                type="button"
                onClick={() => {
                  setSelectedBillingStatus(item.key);
                  setSelectedInvoiceItemIds([]);
                }}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>
                  {item.label}
                  <strong>{billingCounts[item.key] || 0}</strong>
                </span>
              </MobileBillingCard>
            ))}
          </MobileBillingSummaryGrid>
          <DesktopBillingOptions>
            {billingOptions.map((item) => (
              <OptionCard
                key={item.key}
                type="button"
                onClick={() => {
                  setSelectedBillingStatus(item.key);
                  setSelectedInvoiceItemIds([]);
                }}
                style={{
                  borderColor:
                    selectedBillingStatus === item.key
                      ? "rgba(2, 84, 160, 0.34)"
                      : undefined,
                  background:
                    selectedBillingStatus === item.key ? "#f6fbff" : undefined,
                }}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>
                  {item.label}
                  <strong style={{ display: "block", marginTop: 4 }}>
                    {billingCounts[item.key] || 0}
                  </strong>
                </span>
              </OptionCard>
            ))}
          </DesktopBillingOptions>
          <ServicePanelHeader>
            <div>
              <h3>{selectedBillingOption?.label || "Billing"}</h3>
              <p>
                Completed tasks move here automatically, then flow through
                invoice and payment tracking.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <SecondaryBtn type="button" onClick={() => setBillingServicePickerOpen(true)}>
                Create Invoice Items
              </SecondaryBtn>
              {selectedBillingStatus === "INVOICE_TO_BE_RAISED" && selectedInvoiceItemIds.length > 0 && (
                <PrimaryBtn type="button" onClick={openBulkInvoiceForm}>
                  Raise Selected ({selectedInvoiceItemIds.length})
                </PrimaryBtn>
              )}
            </div>
          </ServicePanelHeader>
          {visibleBillingRows.length === 0 ? (
            <EmptyState>
              No records found for {selectedBillingOption?.label || "this section"}.
            </EmptyState>
          ) : (
            <>
            <MobileBillingRows>
              {visibleBillingRows.map((item) => (
                <MobileInvoiceCard key={`mobile-${item.id}`}>
                  <MobileInvoiceHead>
                    <FontAwesomeIcon icon={selectedBillingOption?.icon || faReceipt} />
                    <div>
                      <h4>
                        {item.services?.length > 1 ? item.service : item.service}
                      </h4>
                      <p>{item.taskType || "-"}</p>
                    </div>
                  </MobileInvoiceHead>
                  <MobileInvoiceMeta>
                    <MobileInvoiceLine>
                      <span>{showingPaymentHistory ? "Payment Date" : "Completed Date"}</span>
                      <strong>
                        {formatDate(
                          showingPaymentHistory
                            ? item.paidAt
                            : item.task?.completedAt || item.createdAt,
                        )}
                      </strong>
                    </MobileInvoiceLine>
                    <MobileInvoiceLine>
                      <span>Amount</span>
                      <strong>{item.amount ? formatCurrency(item.amount) : "-"}</strong>
                    </MobileInvoiceLine>
                    <MobileInvoiceLine>
                      <span>{showingPaymentHistory ? "Amount Paid" : "Paid"}</span>
                      <strong>{item.paidAmount ? formatCurrency(item.paidAmount) : "-"}</strong>
                    </MobileInvoiceLine>
                    {!showingPaymentHistory && (
                      <MobileInvoiceLine>
                        <span>Balance</span>
                        <strong>{item.balanceAmount ? formatCurrency(item.balanceAmount) : "-"}</strong>
                      </MobileInvoiceLine>
                    )}
                    <MobileInvoiceLine>
                      <span>Invoice No.</span>
                      <strong>{item.invoiceNumber || "-"}</strong>
                    </MobileInvoiceLine>
                    <MobileInvoiceLine>
                      <span>Status Date</span>
                      <strong>
                        {formatDate(
                          item.paidAt ||
                            item.paymentPendingAt ||
                            item.invoiceRaisedAt ||
                            item.createdAt,
                        )}
                      </strong>
                    </MobileInvoiceLine>
                  </MobileInvoiceMeta>
                  {!showingPaymentHistory && (
                    <>
                      {item.status === "INVOICE_TO_BE_RAISED" && (
                        <MobileFullBtn type="button" onClick={() => openInvoiceForm(item)}>
                          Raise Invoice
                        </MobileFullBtn>
                      )}
                      {showingInvoicesRaised && item.invoiceRaisedAt && (
                        <ActionGroup>
                          <SecondaryBtn type="button" onClick={() => openInvoiceForm(item)}>
                            Edit Invoice
                          </SecondaryBtn>
                          <IconAction
                            aria-label={`Delete invoice for ${item.service}`}
                            disabled={savingBilling}
                            title="Delete invoice"
                            type="button"
                            onClick={() => setDeleteInvoiceItem(item)}
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </IconAction>
                        </ActionGroup>
                      )}
                      {item.status === "INVOICE_RAISED" && (
                        <MobileFullBtn
                          disabled={savingBilling}
                          type="button"
                          onClick={() => markPaymentPending(item)}
                        >
                          Payment Pending
                        </MobileFullBtn>
                      )}
                      {item.status === "PAYMENT_PENDING" && (
                        <MobileFullBtn
                          disabled={savingBilling}
                          type="button"
                          onClick={() => openPaymentForm(item)}
                        >
                          Record Payment
                        </MobileFullBtn>
                      )}
                    </>
                  )}
                </MobileInvoiceCard>
              ))}
            </MobileBillingRows>
            <DesktopTaskTableWrap>
              <TaskTable>
                <thead>
                  <tr>
                    {selectedBillingStatus === "INVOICE_TO_BE_RAISED" && (
                      <th>
                        <input
                          aria-label="Select all invoice items"
                          checked={
                            selectedBillingItems.length > 0 &&
                            selectedBillingItems.every((item) => selectedInvoiceItemIds.includes(item.id))
                          }
                          type="checkbox"
                          onChange={(e) =>
                            setSelectedInvoiceItemIds(
                              e.target.checked ? selectedBillingItems.map((item) => item.id) : [],
                            )
                          }
                        />
                      </th>
                    )}
                    <th>Service</th>
                    <th>Task Type</th>
                    <th>Completed Date</th>
                    <th>Amount</th>
                    <th>{showingPaymentHistory ? "Amount Paid" : "Paid"}</th>
                    {!showingPaymentHistory && <th>Balance</th>}
                    <th>Invoice No.</th>
                    {showingInvoicesRaised && <th>Current Status</th>}
                    <th>{showingPaymentHistory ? "Payment Date" : "Status Date"}</th>
                    {!showingPaymentHistory && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {visibleBillingRows.map((item) => (
                    <tr key={item.id}>
                      {selectedBillingStatus === "INVOICE_TO_BE_RAISED" && (
                        <td>
                          <input
                            aria-label={`Select ${item.service}`}
                            checked={selectedInvoiceItemIds.includes(item.id)}
                            type="checkbox"
                            onChange={() => toggleInvoiceItem(item.id)}
                          />
                        </td>
                      )}
                      <td style={{ fontWeight: 700 }}>
                        {item.services?.length > 1 ? (
                          <TextAction type="button" onClick={() => setGroupedInvoice(item)}>
                            {item.service}
                          </TextAction>
                        ) : (
                          item.service
                        )}
                      </td>
                      <td>{item.taskType || "-"}</td>
                      <td>{formatDate(item.task?.completedAt || item.createdAt)}</td>
                      <td>{item.amount ? formatCurrency(item.amount) : "-"}</td>
                      <td>{item.paidAmount ? formatCurrency(item.paidAmount) : "-"}</td>
                      {!showingPaymentHistory && (
                        <td>{item.balanceAmount ? formatCurrency(item.balanceAmount) : "-"}</td>
                      )}
                      <td>{item.invoiceNumber || "-"}</td>
                      {showingInvoicesRaised && (
                        <td>
                          <Badge $status={item.status === "PAID" ? "Active" : "Prospect"}>
                            {item.status === "PAID"
                              ? "Paid"
                              : item.status === "PAYMENT_PENDING"
                                ? "Payment Pending"
                                : "Invoice Raised"}
                          </Badge>
                        </td>
                      )}
                      <td>
                        {formatDate(
                          item.paidAt ||
                            item.paymentPendingAt ||
                            item.invoiceRaisedAt ||
                            item.createdAt,
                        )}
                      </td>
                      {!showingPaymentHistory && (
                        <td>
                          <ActionGroup>
                            {item.status === "INVOICE_TO_BE_RAISED" && (
                              <PrimaryBtn type="button" onClick={() => openInvoiceForm(item)}>
                                Raise Invoice
                              </PrimaryBtn>
                            )}
                            {showingInvoicesRaised && item.invoiceRaisedAt && (
                              <>
                                <SecondaryBtn type="button" onClick={() => openInvoiceForm(item)}>
                                  Edit Invoice
                                </SecondaryBtn>
                                <IconAction
                                  aria-label={`Delete invoice for ${item.service}`}
                                  disabled={savingBilling}
                                  title="Delete invoice"
                                  type="button"
                                  onClick={() => setDeleteInvoiceItem(item)}
                                >
                                  <FontAwesomeIcon icon={faTrashCan} />
                                </IconAction>
                              </>
                            )}
                            {item.status === "INVOICE_RAISED" && (
                              <PrimaryBtn
                                disabled={savingBilling}
                                type="button"
                                onClick={() => markPaymentPending(item)}
                              >
                                Payment Pending
                              </PrimaryBtn>
                            )}
                            {item.status === "PAYMENT_PENDING" && (
                              <PrimaryBtn
                                disabled={savingBilling}
                                type="button"
                                onClick={() => openPaymentForm(item)}
                              >
                                Record Payment
                              </PrimaryBtn>
                            )}
                          </ActionGroup>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </TaskTable>
            </DesktopTaskTableWrap>
            </>
          )}
        </Panel>
      )}

      {billingServicePickerOpen && (
        <ModalOverlay onClick={() => setBillingServicePickerOpen(false)}>
          <Modal onSubmit={createInvoiceItems} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Create Invoice Items</h3>
              <button type="button" onClick={() => setBillingServicePickerOpen(false)}>
                x
              </button>
            </ModalHeader>
            <ModalBody>
              <FullField>
                <CompactGroup>
                  <h4>Compliance</h4>
                  <CompactCheckGrid>
                  {invoiceServiceOptions
                    .filter((item) => item.taskType === "Compliance")
                    .map((item) => {
                      const checked = selectedInvoiceServices.some(
                        (selected) => selected.service === item.service && selected.taskType === item.taskType,
                      );
                      return (
                        <CompactCheck
                          $checked={checked}
                          key={`${item.taskType}-${item.service}`}
                        >
                          <input checked={checked} type="checkbox" onChange={() => toggleInvoiceService(item)} />
                          <FontAwesomeIcon icon={item.icon} />
                          <span>{item.service}</span>
                        </CompactCheck>
                      );
                    })}
                  </CompactCheckGrid>
                </CompactGroup>
              </FullField>
              <FullField>
                <CompactGroup>
                  <h4>Notices</h4>
                  <CompactCheckGrid>
                  {invoiceServiceOptions
                    .filter((item) => item.taskType === "Notice")
                    .map((item) => {
                      const checked = selectedInvoiceServices.some(
                        (selected) => selected.service === item.service && selected.taskType === item.taskType,
                      );
                      return (
                        <CompactCheck
                          $checked={checked}
                          key={`${item.taskType}-${item.service}`}
                        >
                          <input checked={checked} type="checkbox" onChange={() => toggleInvoiceService(item)} />
                          <FontAwesomeIcon icon={item.icon} />
                          <span>{item.service}</span>
                        </CompactCheck>
                      );
                    })}
                  </CompactCheckGrid>
                </CompactGroup>
              </FullField>
              <Hint style={{ gridColumn: "1/-1", margin: 0 }}>
                Selected services will appear under Invoices to be Raised.
              </Hint>
              <ModalActions>
                <SecondaryBtn type="button" onClick={() => setBillingServicePickerOpen(false)}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn disabled={savingBilling} type="submit">
                  {savingBilling ? "Creating..." : `Create ${selectedInvoiceServices.length || ""} Item${selectedInvoiceServices.length === 1 ? "" : "s"}`}
                </PrimaryBtn>
              </ModalActions>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {groupedInvoice && (
        <ModalOverlay onClick={() => setGroupedInvoice(null)}>
          <Modal as="div" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Invoice Services</h3>
              <button type="button" onClick={() => setGroupedInvoice(null)}>
                x
              </button>
            </ModalHeader>
            <HistoryBody>
              <HistoryGrid>
                <HistoryItem>
                  <strong>Invoice Amount</strong>
                  {formatCurrency(groupedInvoice.amount)}
                </HistoryItem>
                <HistoryItem>
                  <strong>Invoice Number</strong>
                  {groupedInvoice.invoiceNumber || "-"}
                </HistoryItem>
              </HistoryGrid>
              <TableWrap>
                <TaskTable>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(groupedInvoice.services || []).map((item, index) => (
                      <tr key={`${item.service}-${index}`}>
                        <td style={{ fontWeight: 700 }}>{item.service}</td>
                        <td>{item.taskType || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </TaskTable>
              </TableWrap>
            </HistoryBody>
          </Modal>
        </ModalOverlay>
      )}

      {invoiceItem && (
        <ModalOverlay onClick={() => setInvoiceItem(null)}>
          <Modal onSubmit={raiseInvoice} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{invoiceItem.invoiceRaisedAt ? "Edit Invoice" : "Raise Invoice"}</h3>
              <button type="button" onClick={() => setInvoiceItem(null)}>
                x
              </button>
            </ModalHeader>
            <ModalBody>
              <FullField>
                Service
                <input readOnly value={invoiceItem.service || ""} />
              </FullField>
              {invoiceItem.bulk && (
                <FullField>
                  Selected Services
                  <textarea
                    readOnly
                    value={invoiceItem.items.map((item) => `${item.taskType || "-"} - ${item.service}`).join("\n")}
                  />
                </FullField>
              )}
              <Field>
                Invoice Amount
                <input
                  required
                  min="1"
                  step="1"
                  type="number"
                  placeholder="Enter amount"
                  value={invoiceForm.amount}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, amount: e.target.value })
                  }
                />
              </Field>
              <Field>
                Invoice Number
                <input
                  placeholder="Optional invoice number"
                  value={invoiceForm.invoiceNumber}
                  onChange={(e) =>
                    setInvoiceForm({
                      ...invoiceForm,
                      invoiceNumber: e.target.value,
                    })
                  }
                />
              </Field>
              {invoiceItem.bulk && (
                <Hint style={{ gridColumn: "1/-1", margin: 0 }}>
                  This is one invoice total for all selected services.
                </Hint>
              )}
              <ModalActions>
                <SecondaryBtn type="button" onClick={() => setInvoiceItem(null)}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn disabled={savingBilling} type="submit">
                  {savingBilling
                    ? invoiceItem.invoiceRaisedAt
                      ? "Saving..."
                      : "Raising..."
                    : invoiceItem.invoiceRaisedAt
                      ? "Save Invoice"
                      : "Raise Invoice"}
                </PrimaryBtn>
              </ModalActions>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {paymentItem && (
        <ModalOverlay onClick={() => setPaymentItem(null)}>
          <Modal onSubmit={recordPayment} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Record Payment</h3>
              <button type="button" onClick={() => setPaymentItem(null)}>
                x
              </button>
            </ModalHeader>
            <ModalBody>
              <HistoryItem>
                <strong>Invoice Amount</strong>
                {formatCurrency(paymentItem.amount)}
              </HistoryItem>
              <HistoryItem>
                <strong>Already Paid</strong>
                {formatCurrency(paymentItem.paidAmount)}
              </HistoryItem>
              <HistoryItem>
                <strong>Pending Balance</strong>
                {formatCurrency(paymentItem.balanceAmount)}
              </HistoryItem>
              <Field>
                Received Amount
                <input
                  required
                  min="1"
                  max={paymentItem.balanceAmount || paymentItem.amount || 1}
                  step="1"
                  type="number"
                  placeholder="Enter received amount"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                />
              </Field>
              <FullField>
                Payment Note
                <textarea
                  placeholder="Optional payment note"
                  value={paymentForm.note}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, note: e.target.value })
                  }
                />
              </FullField>
              <ModalActions>
                <SecondaryBtn type="button" onClick={() => setPaymentItem(null)}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn disabled={savingBilling} type="submit">
                  {savingBilling ? "Recording..." : "Record Payment"}
                </PrimaryBtn>
              </ModalActions>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {deleteInvoiceItem && (
        <ConfirmDialog
          title="Delete invoice?"
          message="This will remove the raised invoice and all payments recorded against it. The service will move back to Invoices to be Raised."
          confirmLabel={savingBilling ? "Deleting..." : "Delete"}
          onCancel={() => setDeleteInvoiceItem(null)}
          onConfirm={deleteRaisedInvoice}
        />
      )}

      {selectedTaskHistory && (
        <ModalOverlay onClick={() => setSelectedTaskHistory(null)}>
          <Modal as="div" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{selectedTaskHistory.service} History</h3>
              <button
                type="button"
                onClick={() => setSelectedTaskHistory(null)}
              >
                x
              </button>
            </ModalHeader>
            <HistoryBody>
              <HistoryGrid>
                <HistoryItem>
                  <strong>Task Type</strong>
                  {selectedTaskHistory.taskType || "Compliance"}
                </HistoryItem>
                <HistoryItem>
                  <strong>Assigned Date</strong>
                  {formatDate(selectedTaskHistory.createdAt)}
                </HistoryItem>
                <HistoryItem>
                  <strong>Due Date</strong>
                  {formatDate(selectedTaskHistory.dueDate)}
                </HistoryItem>
                <HistoryItem>
                  <strong>Assigned To</strong>
                  {selectedTaskHistory.assignedTo?.name ||
                    selectedTaskHistory.assignedTo?.email ||
                    "-"}
                </HistoryItem>
                <HistoryItem>
                  <strong>Assigned By</strong>
                  {selectedTaskHistory.assignedBy?.name ||
                    selectedTaskHistory.assignedBy?.email ||
                    "-"}
                </HistoryItem>
                <HistoryItem>
                  <strong>Work Preference</strong>
                  {selectedTaskHistory.workPreference || "-"}
                </HistoryItem>
              </HistoryGrid>
              <TableWrap>
                <TaskTable>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Action</th>
                      <th>Status</th>
                      <th>By</th>
                      <th>Comment / Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskHistoryRows.map((row, index) => (
                      <tr key={`${row.action}-${row.date || index}`}>
                        <td>{formatDateTime(row.date)}</td>
                        <td style={{ fontWeight: 700 }}>{row.action}</td>
                        <td>
                          {row.status && row.status !== "-" ? (
                            <Badge $status={row.status}>{row.status}</Badge>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{row.by}</td>
                        <td>{row.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </TaskTable>
              </TableWrap>
            </HistoryBody>
          </Modal>
        </ModalOverlay>
      )}

      {selectedService && (
        <ModalOverlay onClick={() => setSelectedService(null)}>
          <Modal
            onSubmit={createComplianceTask}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <h3>Assign {selectedService}</h3>
              <button type="button" onClick={() => setSelectedService(null)}>
                x
              </button>
            </ModalHeader>
            <ModalBody>
              <Field>
                Due Date
                <input
                  required
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                  }
                />
              </Field>
              <Field>
                Assign
                <select
                  required
                  value={taskForm.assignedTo}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, assignedTo: e.target.value })
                  }
                >
                  <option value="">Select employee</option>
                  {assignableEmployees.length === 0 && (
                    <option disabled value="">
                      No eligible employees
                    </option>
                  )}
                  {assignableEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name || employee.email}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                Work Status
                <select
                  value={taskForm.workStatus}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, workStatus: e.target.value })
                  }
                >
                  {[
                    "Pending",
                    "In Progress",
                    "Waiting for Client",
                    "Completed",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field>
                Work Preference
                <select
                  value={taskForm.workPreference}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      workPreference: e.target.value,
                    })
                  }
                >
                  {["Low", "Medium", "High", "Urgent"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <FullField>
                Repeat
                <select
                  value={taskForm.recurrenceFrequency}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, recurrenceFrequency: e.target.value })
                  }
                >
                  <option value="NONE">Just this month</option>
                  <option value="MONTHLY">Repeat every month</option>
                  <option value="QUARTERLY">Quarterly repeat</option>
                  <option value="YEARLY">Yearly repeat</option>
                </select>
              </FullField>
              <FullField>
                Description
                <textarea
                  required
                  placeholder="Write what the employee needs to do for this task"
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                />
              </FullField>
              <FullField>
                Initial Comment
                <textarea
                  placeholder="Optional note for the assigned employee"
                  value={taskForm.comment}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, comment: e.target.value })
                  }
                />
              </FullField>
              <ModalActions>
                <SecondaryBtn
                  type="button"
                  onClick={() => setSelectedService(null)}
                >
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn disabled={savingTask} type="submit">
                  {savingTask ? "Assigning..." : "Assign Task"}
                </PrimaryBtn>
              </ModalActions>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {reassignTask && (
        <ModalOverlay onClick={() => setReassignTask(null)}>
          <Modal onSubmit={submitReassignTask} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Reassign {reassignTask.service}</h3>
              <button type="button" onClick={() => setReassignTask(null)}>
                x
              </button>
            </ModalHeader>
            <ModalBody>
              <FullField>
                Employee
                <select
                  required
                  value={reassignTo}
                  onChange={(e) => setReassignTo(e.target.value)}
                >
                  <option value="">Select active employee</option>
                  {assignableEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name || employee.email}
                    </option>
                  ))}
                </select>
              </FullField>
              <Hint style={{ gridColumn: "1/-1", margin: 0 }}>
                The original assignee is inactive, so this monthly task needs an active employee.
              </Hint>
              <ModalActions>
                <SecondaryBtn type="button" onClick={() => setReassignTask(null)}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn disabled={savingTask} type="submit">
                  {savingTask ? "Reassigning..." : "Reassign Task"}
                </PrimaryBtn>
              </ModalActions>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}
    </DetailShell>
  );
}

export default function ClientManagement() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const [searchParams] = useSearchParams();
  const canCreateClient =
    ["SUPER_ADMIN", "ADMIN"].includes(admin?.role) ||
    hasPermission(admin, "clients.create");
  const canEditClient =
    ["SUPER_ADMIN", "ADMIN"].includes(admin?.role) ||
    hasPermission(admin, "clients.edit");
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({
    totalClients: 0,
    invoicesRaisedCount: 0,
    pendingInvoicesCount: 0,
    paymentPendingAmount: 0,
  });
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const billingFilter = searchParams.get("billing") || "";

  const load = useCallback(async () => {
    setLoading(true);
    const q = new URLSearchParams({ page, limit: 10 });
    if (search) q.set("search", search);
    if (status !== "All") q.set("status", status);
    if (billingFilter) q.set("billing", billingFilter);
    const res = await api.get(`/clients?${q}`);
    if (res.success) {
      setClients(res.clients);
      setTotal(res.total);
      setPages(res.pages);
      setSummary({
        totalClients: res.summary?.totalClients ?? res.total ?? 0,
        invoicesRaisedCount: res.summary?.invoicesRaisedCount ?? 0,
        pendingInvoicesCount: res.summary?.pendingInvoicesCount ?? 0,
        paymentPendingAmount: res.summary?.paymentPendingAmount ?? 0,
      });
    }
    setLoading(false);
  }, [billingFilter, page, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditing(client);
    setForm({ ...initialForm, ...client });
    setModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    const res = editing
      ? await api.patch(`/clients/${editing.id}`, form)
      : await api.post("/clients", form);
    setSaving(false);
    if (res.success) {
      toast.success(editing ? "Client updated" : "Client added");
      setModalOpen(false);
      load();
    } else {
      toast.error(res.message || "Unable to save client");
    }
  };

  if (clientId) {
    return <ClientDetail canEditClient={canEditClient} />;
  }

  const clientStats = [
    {
      label: "Total Clients",
      value: summary.totalClients || total || clients.length,
      icon: faUsers,
      bg: "#eaf3fb",
      color: "#0254a0",
    },
    {
      label: "Invoices Raised",
      value: summary.invoicesRaisedCount || 0,
      icon: faFileInvoiceDollar,
      bg: "#ecfdf3",
      color: "#087443",
    },
    {
      label: "Pending Invoices",
      value: summary.pendingInvoicesCount || 0,
      icon: faFileInvoice,
      bg: "#fffbeb",
      color: "#b45309",
    },
    {
      label: "Payment Pending",
      value: formatCurrency(summary.paymentPendingAmount || 0),
      icon: faMoneyBillWave,
      bg: "#fff7ed",
      color: "#f97316",
    },
  ];
  const billingFilterLabels = {
    INVOICE_RAISED: "Showing clients with invoices raised",
    PAID: "Showing clients with paid invoices",
    PAYMENT_PENDING: "Showing clients with pending invoice balances",
  };

  return (
    <div>
      <MobileClientsView>
        <MobileClientsHeader>
          <h2>Clients Overview</h2>
        </MobileClientsHeader>
        {billingFilterLabels[billingFilter] && (
          <ActiveFilterNote>{billingFilterLabels[billingFilter]}</ActiveFilterNote>
        )}
        <MobileSearchBox>
          <FontAwesomeIcon icon={faSearch} />
          <input
            placeholder="Search company, name, phone, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </MobileSearchBox>
        <MobileControlRow>
          <MobileSelect
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {["All", "Active", "Inactive", "Prospect", "Closed"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </MobileSelect>
          <MobileFilterBtn type="button" onClick={load}>
            <FontAwesomeIcon icon={faFilter} />
            Filter
          </MobileFilterBtn>
          {canCreateClient && (
            <MobileAddBtn type="button" onClick={openCreate}>
              + Add Client
            </MobileAddBtn>
          )}
        </MobileControlRow>
        <ClientSummaryGrid>
          {clientStats.map((item) => (
            <MobileStatCard key={item.label}>
              <MobileStatIcon $bg={item.bg} $color={item.color}>
                <FontAwesomeIcon icon={item.icon} />
              </MobileStatIcon>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </MobileStatCard>
          ))}
        </ClientSummaryGrid>
        {loading ? (
          <MobileClientList>
            {Array.from({ length: 3 }).map((_, index) => (
              <MobileClientCard key={index}>
                <Skeleton style={{ height: 92 }} />
                <Skeleton />
                <Skeleton />
              </MobileClientCard>
            ))}
          </MobileClientList>
        ) : clients.length === 0 ? (
          <EmptyState>No clients found.</EmptyState>
        ) : (
          <MobileClientList>
            {clients.map((client, index) => {
              const accent =
                index % 3 === 1
                  ? { bg: "#f3e8ff", color: "#7c3aed" }
                  : index % 3 === 2
                    ? { bg: "#dcfce7", color: "#15803d" }
                    : { bg: "#eaf3fb", color: "#0254a0" };
              return (
                <MobileClientCard
                  key={client.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/admin/clients/${client.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/admin/clients/${client.id}`);
                  }}
                >
                  <MobileClientTop>
                    <MobileClientLogo $tone={accent.bg} $color={accent.color}>
                      <FontAwesomeIcon icon={faBuildingColumns} />
                    </MobileClientLogo>
                    <MobileClientTitle>
                      <h3>{client.companyName || client.name || "Unnamed Client"}</h3>
                      <p>
                        <FontAwesomeIcon icon={faUsers} />
                        {client.name || client.companyName || "-"}
                      </p>
                    </MobileClientTitle>
                    <Badge $status={client.status}>{client.status}</Badge>
                  </MobileClientTop>
                  <MobileClientDetails>
                    <MobileClientMeta>
                      <FontAwesomeIcon icon={faPhone} />
                      <span>{client.phone || "-"}</span>
                    </MobileClientMeta>
                    <MobileClientMeta>
                      <FontAwesomeIcon icon={faEnvelope} />
                      <span>{client.email || "-"}</span>
                    </MobileClientMeta>
                    <MobileClientMeta>
                      <FontAwesomeIcon icon={faIdCard} />
                      <span>PAN: {client.pan || "-"}</span>
                    </MobileClientMeta>
                    <MobileClientMeta>
                      <FontAwesomeIcon icon={faFileInvoice} />
                      <span>GST: {client.gstin || "-"}</span>
                    </MobileClientMeta>
                    <MobileAddress>
                      <FontAwesomeIcon icon={faLocationDot} />
                      <span>{client.address || "-"}</span>
                    </MobileAddress>
                  </MobileClientDetails>
                  <MobileBillingMiniGrid>
                    <MobileBillingMini>
                      <span>Invoices Raised</span>
                      <strong>{client.invoicesRaisedCount || 0}</strong>
                    </MobileBillingMini>
                    <MobileBillingMini $pending={Number(client.pendingInvoicesCount || 0) > 0}>
                      <span>Pending Invoices</span>
                      <strong>{client.pendingInvoicesCount || 0}</strong>
                    </MobileBillingMini>
                    <MobileBillingMini $pending={Number(client.paymentPendingAmount || 0) > 0}>
                      <span>Payment Pending</span>
                      <strong>{formatCurrency(client.paymentPendingAmount || 0)}</strong>
                    </MobileBillingMini>
                  </MobileBillingMiniGrid>
                  <MobileCardActions>
                    <MobileOutlineBtn
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/clients/${client.id}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View
                    </MobileOutlineBtn>
                    {canEditClient && (
                      <MobileOutlineBtn
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(client);
                        }}
                      >
                        <FontAwesomeIcon icon={faPen} />
                        Edit
                      </MobileOutlineBtn>
                    )}
                  </MobileCardActions>
                </MobileClientCard>
              );
            })}
          </MobileClientList>
        )}
        <Pagination page={page} pages={pages} total={total} limit={10} onPage={setPage} />
      </MobileClientsView>

      <DesktopClientsView>
        <PageHeader>
          <div>
            <h2>Client Management</h2>
            <p>Add and maintain client records manually.</p>
          </div>
          {canCreateClient && (
            <PrimaryBtn onClick={openCreate}>+ Add Client</PrimaryBtn>
          )}
        </PageHeader>

        <ClientSummaryGrid>
          {clientStats.map((item) => (
            <MobileStatCard key={item.label}>
              <MobileStatIcon $bg={item.bg} $color={item.color}>
                <FontAwesomeIcon icon={item.icon} />
              </MobileStatIcon>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </MobileStatCard>
          ))}
        </ClientSummaryGrid>

        <Toolbar>
          <Input
            placeholder="Search name, company, email, phone, PAN, GST..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {["All", "Active", "Inactive", "Prospect", "Closed"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <SecondaryBtn onClick={load}>Filter</SecondaryBtn>
        </Toolbar>
        {billingFilterLabels[billingFilter] && (
          <ActiveFilterNote>{billingFilterLabels[billingFilter]}</ActiveFilterNote>
        )}

        <ClientListTableWrap>
          <Table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>GST</th>
                <th>Address</th>
                <th>Status</th>
                <th>Invoices Raised</th>
                <th>Pending Invoices</th>
                <th>Payment Pending</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((__, j) => (
                      <td key={j}>
                        <Skeleton />
                      </td>
                    ))}
                  </tr>
                ))
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <Empty>
                      <p>No clients found</p>
                      {canCreateClient && (
                        <PrimaryBtn onClick={openCreate}>+ Add Client</PrimaryBtn>
                      )}
                    </Empty>
                  </td>
                </tr>
              ) : (
                clients.map((client, index) => (
                  <ClickableRow
                    key={client.id}
                    tabIndex={0}
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        navigate(`/admin/clients/${client.id}`);
                    }}
                  >
                    <td>
                      <DesktopClientCell>
                        <DesktopClientAvatar $bg={avatarColors[index % avatarColors.length]}>
                          {clientInitials(client)}
                        </DesktopClientAvatar>
                        <DesktopClientName title={client.companyName || client.name || "Unnamed Client"}>
                          {client.companyName || client.name || "Unnamed Client"}
                        </DesktopClientName>
                      </DesktopClientCell>
                    </td>
                    <td>
                      <DesktopMutedCell $width="150px" title={client.name || client.contactPerson || "-"}>
                        {client.name || client.contactPerson || "-"}
                      </DesktopMutedCell>
                    </td>
                    <td>{client.phone || "-"}</td>
                    <td>
                      <DesktopEmail $width="190px" title={client.email || "-"}>
                        {client.email || "-"}
                      </DesktopEmail>
                    </td>
                    <td>{client.gstin || "-"}</td>
                    <td>
                      <DesktopMutedCell $width="210px" title={client.address || "-"}>
                        {client.address || "-"}
                      </DesktopMutedCell>
                    </td>
                    <td>
                      <Badge $status={client.status}>{client.status}</Badge>
                    </td>
                    <td>
                      <DesktopCountValue>{client.invoicesRaisedCount || 0}</DesktopCountValue>
                    </td>
                    <td>
                      <DesktopCountValue>{client.pendingInvoicesCount || 0}</DesktopCountValue>
                    </td>
                    <td>
                      <DesktopPayment $pending={Number(client.paymentPendingAmount || 0) > 0}>
                        {formatCurrency(client.paymentPendingAmount || 0)}
                      </DesktopPayment>
                    </td>
                  </ClickableRow>
                ))
              )}
            </tbody>
          </Table>
          <div style={{ padding: "0 16px 16px" }}>
            <Pagination
              page={page}
              pages={pages}
              total={total}
              limit={10}
              onPage={setPage}
            />
          </div>
        </ClientListTableWrap>
      </DesktopClientsView>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <Modal onSubmit={handleSave} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{editing ? "Edit Client" : "Add Client"}</h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                x
              </button>
            </ModalHeader>
            <ModalBody>
              <Field>
                Name
                <input
                  required
                  placeholder="Rahul Mehta"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field>
                Company Name
                <input
                  placeholder="Mehta Traders Pvt Ltd"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                />
              </Field>
              <Field>
                Phone Number
                <input
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
              <Field>
                Email
                <input
                  type="email"
                  placeholder="rahul.mehta@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field>
                PAN Number
                <input
                  placeholder="ABCDE1234F"
                  value={form.pan}
                  onChange={(e) =>
                    setForm({ ...form, pan: e.target.value.toUpperCase() })
                  }
                />
              </Field>
              <Field>
                GST Number
                <input
                  placeholder="07ABCDE1234F1Z5"
                  value={form.gstin}
                  onChange={(e) =>
                    setForm({ ...form, gstin: e.target.value.toUpperCase() })
                  }
                />
              </Field>
              <Field>
                Client Type
                <select
                  value={form.clientType}
                  onChange={(e) =>
                    setForm({ ...form, clientType: e.target.value })
                  }
                >
                  {[
                    "Individual",
                    "Proprietorship",
                    "Partnership",
                    "LLP",
                    "Company",
                    "Trust",
                    "Other",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field>
                Service
                <input
                  placeholder="GST, Income Tax, Audit..."
                  value={form.service}
                  onChange={(e) =>
                    setForm({ ...form, service: e.target.value })
                  }
                />
              </Field>
              <Field>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["Active", "Inactive", "Prospect", "Closed"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field>
                Contact Person
                <input
                  placeholder="Priya Mehta"
                  value={form.contactPerson}
                  onChange={(e) =>
                    setForm({ ...form, contactPerson: e.target.value })
                  }
                />
              </Field>
              <FullField>
                Address
                <textarea
                  placeholder="123 MG Road, Connaught Place, New Delhi"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </FullField>
              <FullField>
                Notes
                <textarea
                  placeholder="Monthly GST filing and annual income tax return"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </FullField>
              <ModalActions>
                <SecondaryBtn type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn disabled={saving} type="submit">
                  {saving ? "Saving..." : "Save Client"}
                </PrimaryBtn>
              </ModalActions>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}
    </div>
  );
}
