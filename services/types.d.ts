export interface User {
    created_at:     Date;
    email:          string;
    email_verified: boolean;
    identities:     Identity[];
    name:           string;
    nickname:       string;
    picture:        string;
    updated_at:     Date;
    user_id:        string;
    user_metadata:  UserMetadata;
    last_ip:        string;
    last_login:     Date;
    logins_count:   number;
}

export interface Identity {
    connection: string;
    provider:   string;
    user_id:    string;
    isSocial:   boolean;
}

export interface UserMetadata {
    company:  string;
    jobTitle: string;
    theme:    string;
}

