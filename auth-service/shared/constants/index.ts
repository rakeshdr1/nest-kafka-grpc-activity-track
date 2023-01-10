class Constants {
  readonly KAFKA_TOPICS = {
    AUTH: {
      SIGN_IN: 'sign-in',
      SIGN_UP: 'sign-up',
      VERIFY_TOKEN: 'verify-token',
      UPDATE_TOKEN: 'update-token',
    },
    USER: {
      USER_CREATED: 'user-created',
    },
    ACTIVITY: {
      FIND_ALL: 'find-all-activity',
      FIND_ONE: 'find-one-activity',
      CREATE: 'create-activity',
      UPDATE: 'update-activity',
      REMOVE: 'remove-activity',
    },
  };
}

export const CONSTANTS = new Constants();
