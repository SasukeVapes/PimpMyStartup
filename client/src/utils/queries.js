import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      password
      createdFundraisers {
        posterUsername
        description
        image
        title
        id
        contributions {
          contributorUsername
          contributedAmount
          contributedAt
        }
        createdAt
      }
    }
  }
`;

export const GET_ALL_FUNDRAISERS = gql`
  query GetAllFundRaisers {
    getAllFundRaisers {
      id
      posterUsername
      description
      image
      title
      contributions {
        contributorUsername
        contributedAmount
        contributedAt
      }
      createdAt
    }
  }
`;

export const GET_FUNDRAISER_BY_ID = gql`
  query GetFundraiserById($fundraiserId: String!) {
    getFundraiserById(fundraiserId: $fundraiserId) {
      id
      posterUsername
      description
      image
      title
      contributions {
        _id
        contributorUsername
        contributedAmount
        contributedAt
      }
      createdAt
    }
  }
`;
export const GET_REPORTS = gql`
  query GetReports {
    getReports {
      _id
      reporter
      description
      status
      dateSubmitted
      fundraiserOrContributionID
    }
  }
`;
export const CREATE_ANALYTICS = gql`
  mutation CreateAnalytics($analyticsInput: AnalyticsInput!) {
    createAnalytics(analyticsInput: $analyticsInput) {
      totalFundsRaised
      numberOfFundraisersCreated
      averageDonationAmount
      popularCategoriesTags
      userActivityTrends {
        signUps
        logins
        donations
      }
    }
  }
`;
export const GET_ACTIVITY_LOGS = gql`
  query GetActivityLogs {
    getActivityLogs {
      _id
      userPerformingAction {
        _id
      }
      actionType
      timestamp
      description
      ipAddress
    }
  }
`;
export const GET_ALL_REFUNDS = gql`
  query GetAllRefunds {
    getAllDonationRefundRequests {
      _id
      userRequestingRefund
      contributionID
      fundraiserID
      reasonForRefund
      status
      administratorComments
      dateRequested
    }
  }
`;