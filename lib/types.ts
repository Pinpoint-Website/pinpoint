export type PostProps = {
    postId: number;
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