export type SurveyType = 'Delivery' | '7-Day' | '30-Day';
export type CaseStatus = 'เปิดอยู่' | 'กำลังดำเนินการ' | 'แก้ไขแล้ว';

export interface SurveyResponse {
  ResponseID: string;
  Timestamp: string;
  CustomerID: string;
  SalespersonID: string;
  CarModel?: string;
  SurveyType: SurveyType;
  Sales_InfoClarity: number; // 1-5
  Sales_GoodFeedback: string;
  Complaint_Details: string;
  Complaint_AttachmentURL: string;
  FollowUp_Requested: 'ใช่' | 'ไม่ใช่';
  Status: CaseStatus;
}

export interface Customer {
  CustomerID: string;
  Name: string;
  Phone: string;
  Email: string;
  CarModel: string;
  DeliveryDate: string;
}

export interface Salesperson {
  SalespersonID: string;
  Name: string;
  Team: string;
}

export interface DashboardSummary {
  satisfactionScore: number;
  nps: number;
  followUps: number;
}
