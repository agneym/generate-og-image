export interface IFileProps {
  filename: string;
  attributes: Partial<IProps>;
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
