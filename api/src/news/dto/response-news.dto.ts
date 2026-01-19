export class ResponseBaseNewsDto {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  images: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ResponseNewsDto extends ResponseBaseNewsDto {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
