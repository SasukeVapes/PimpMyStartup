const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Fundraiser {
    id: String!
    posterUsername: String!
    description: String!
    image: String
    title: String!
    contributions: [Contribution]
    createdAt: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String
    createdFundraisers: [Fundraiser]
  }

  type Contribution {
    contributorUsername: String!
    contributedAmount: Float
    contributedAt: String
  }
  type Auth {
    token: ID!
    user: User
  }
  
  type ActivityLog {
    _id: ID!
    userPerformingAction: User
    actionType: String!
    timestamp: String
    description: String!
    ipAddress: String
  }

  type Analytics {
    totalFundsRaised: Float
    numberOfFundraisersCreated: Int
    averageDonationAmount: Float
    popularCategoriesTags: [String]
    userActivityTrends: UserActivityTrends
  }
  
  type UserActivityTrends {
    signUps: Int
    logins: Int
    donations: Int
  }

  type CampaignUpdate {
    _id: ID!
    fundraiserID: ID!
    title: String!
    content: String!
    datePosted: String
  }

  type DonationRefundRequest {
    _id: ID!
    userRequestingRefund: ID!
    contributionID: ID!
    fundraiserID: ID!
    reasonForRefund: String!
    status: String!
    administratorComments: String
    dateRequested: String
  }

  type Report {
    _id: ID!
    reporter: ID!
    description: String!
    status: String!
    dateSubmitted: String
    fundraiserOrContributionID: ID
  }
  
  input ReportInput {
    reporter: ID!
    description: String!
    fundraiserOrContributionID: ID
  }
  
  input DonationRefundRequestInput {
    userRequestingRefund: ID!
    contributionID: ID!
    fundraiserID: ID!
    reasonForRefund: String!
  }

  input CampaignUpdateInput {
    fundraiserID: ID!
    title: String!
    content: String!
  }

  input ContributionInput {
    contributerEmail: String!
    contributedAmount: Float
    fundraiserId: String!
  }

  input FundraiserInput {
    posterUsername: String!
    description: String!
    image: String
    title: String!
  }

  input CreditCard {
    name: String!
    number: String!
    expirationMonth: String!
    expirationYear: String!
    cvv: String!
  }

  input AnalyticsInput {
    totalFundsRaised: Float
    numberOfFundraisersCreated: Int
    averageDonationAmount: Float
    popularCategoriesTags: [String]
    userActivityTrends: UserActivityTrendsInput
  }
  
  input UserActivityTrendsInput {
    signUps: Int
    logins: Int
    donations: Int
  }

  type Query {
    me: User
    createdFundraisers: [Fundraiser]
    getFundraiserById(fundraiserId: String!): Fundraiser
    getAllFundRaisers: [Fundraiser]
    getActivityLogs: [ActivityLog]
    getAnalytics: [Analytics]
    getCampaignUpdatesByFundraiser(fundraiserID: ID!): [CampaignUpdate]
    getDonationRefundRequestsByUser(userRequestingRefund: ID!): [DonationRefundRequest]
    getReportsByUser(reporter: ID!): [Report]
    getReports: [Report]
  }
  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addFundraiser(
      description: String!
      posterUsername: String!
      image: String!
      title: String!
    ): User
    removeFundraiser(fundraiserId: String!): User
    addContribution(
      contributorUsername: String!
      contributedAmount: Float
      fundraiserId: String!
      card: CreditCard!
    ): Fundraiser
    addActivityLog(actionType: String!, description: String!): ActivityLog
    
    createAnalytics(analyticsInput: AnalyticsInput): Analytics
    updateAnalytics(analyticsInput: AnalyticsInput): Analytics
    addCampaignUpdate(campaignUpdateInput: CampaignUpdateInput): CampaignUpdate
    requestDonationRefund(donationRefundRequestInput: DonationRefundRequestInput): DonationRefundRequest
    updateDonationRefundRequestStatus(refundRequestID: ID!, status: String!, administratorComments: String): DonationRefundRequest
    submitReport(reportInput: ReportInput): Report
    updateReportStatus(reportID: ID!, status: String!): Report
  }
  
`;

module.exports = typeDefs;
