export interface IFileProps {
  filename: string;
  attributes: Partial<IRepoProps>;
}

export interface IProps {
  title: string;
  subtitle: string;
  filename: string;
  imageUrl: string;
}

export interface IFrontMatter {
  ogImage: IProps;
}

export interface IRepoProps extends IProps {
  assetPath: string;
  commitMsg: string;
}
