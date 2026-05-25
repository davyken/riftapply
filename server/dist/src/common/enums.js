"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationStatus = exports.NotificationType = exports.ApplicationStatus = exports.AgentType = exports.AccountStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["AGENT"] = "agent";
    UserRole["UNIVERSITY"] = "university";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "active";
    AccountStatus["PENDING"] = "pending";
    AccountStatus["REJECTED"] = "rejected";
    AccountStatus["BLOCKED"] = "blocked";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var AgentType;
(function (AgentType) {
    AgentType["PERSONAL"] = "personal";
    AgentType["COMPANY"] = "company";
})(AgentType || (exports.AgentType = AgentType = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING_REVIEW"] = "pending_review";
    ApplicationStatus["APPROVED"] = "approved";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["SENT_TO_UNIVERSITY"] = "sent_to_university";
    ApplicationStatus["AWAITING_UNIVERSITY_RESPONSE"] = "awaiting_university_response";
    ApplicationStatus["ACCEPTED_BY_UNIVERSITY"] = "accepted_by_university";
    ApplicationStatus["REFUSED_BY_UNIVERSITY"] = "refused_by_university";
    ApplicationStatus["INFO_REQUESTED"] = "info_requested";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["SMS"] = "sms";
    NotificationType["DASHBOARD"] = "dashboard";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["DELIVERED"] = "delivered";
    NotificationStatus["READ"] = "read";
    NotificationStatus["FAILED"] = "failed";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
//# sourceMappingURL=enums.js.map