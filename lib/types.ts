export type PostProps = {
    postId: string;
}

export type PostData = {
  shortDesc: string;
  longDesc: string;
  isPublic: boolean;
  creator: number;
};

export type PostDataAndId = {
    id: number
    shortDesc: string,
    longDesc: string,
    isPublic: boolean,
    creator: number
}