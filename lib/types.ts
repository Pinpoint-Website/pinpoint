export type PostProps = {
  postId: string;
}

export type PostData = {
  shortDesc: string;
  longDesc: string;
  isPublic: boolean;
  creator: number;
  tags: string[];
};

export type PostDataAndId = {
  id: string
  shortDesc: string,
  longDesc: string,
  isPublic: boolean,
  creator: number
}

export type PersonalPageData = {
  primaryRole: string,
  description: string
}

export type PersonalPageProps = {
  userId: string
}
