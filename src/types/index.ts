// Friend states
export type FriendState = 'hungry' | 'tired' | 'happy' | 'bored';

// User document in Firestore
export interface UserData {
  uid: string;
  email: string;
  friendName: string;
  friendState: FriendState;
  lastInteraction: Date;
  happinessScore: number;
  createdAt: Date;
}

// Navigation types
export type RootTabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  CreateFriend: undefined;
};

// Interaction types
export type InteractionType = 'feed' | 'play' | 'rest';

export interface Interaction {
  type: InteractionType;
  timestamp: Date;
  previousState: FriendState;
  newState: FriendState;
}