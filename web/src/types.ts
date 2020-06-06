export interface Link {
  mailTo: string;
}

export interface LinkParts {
  recipient: string;
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
}

