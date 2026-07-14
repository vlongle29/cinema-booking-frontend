export type Gender = "MALE" | "FEMALE" | "OTHER";

export type MembershipLevel =
   | "BRONZE"
   | "SILVER"
   | "GOLD"
   | "PLATINUM";

export interface CustomerResponse {
   userId: string;
   username: string;
   name: string;
   email: string;
   phone: string;
   dateOfBirth?: string;
   gender?: Gender;
   address?: string;
   city?: string;
   membershipLevel?: MembershipLevel;
   loyaltyPoints?: number;
}

export interface CustomerCreateRequest {
   username: string;
   password: string;
   name: string;
   email: string;
   phone: string;
   dateOfBirth?: string;
   gender?: string;
   address?: string;
   city?: string;
}

export interface CustomerUpdateRequest {
   name?: string;
   phone?: string;
   dateOfBirth?: string;
   gender?: Gender;
   address?: string;
   city?: string;
}

export interface CustomerSearchDTO {
   keyword?: string;
   membershipLevel?: string;
   city?: string;
   page?: number;
   size?: number;
   sortBy?: string;
   sortDirection?: "ASC" | "DESC";
   roleIds?: string[];
}

/** Table row type with id alias for DashboardEntityList selection */
export type Customer = CustomerResponse & { id: string };
