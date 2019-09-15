export interface IFileProps {
  filename: string;
  attributes: Partial<IRepoProps>;
}

export interface IProps {
  title: string;
  subtitle: string;
  filename: string;
  imageUrl: string;
  backgroundColor: string;
  fontColor: string;
}

export interface IFrontMatter {
  ogImage: IProps;
}

export interface IRepoProps extends IProps {
  assetPath: string;
  commitMsg: string;
}
