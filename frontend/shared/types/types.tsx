export type MediaType = {
  mediaType: "video" | "image";
  video: { asset: { playbackId: string } };
  image: { asset: { url: string; metadata: { lqip: string } }; alt: string };
  mobileImage?: { asset: { url: string; metadata: { lqip: string } } };
  mobileVideo?: { asset: { playbackId: string } };
  caption?: string;
};

export type TransitionsType = {
  hidden: {
    opacity: number;
    transition: {
      duration: number;
    };
  };
  visible: {
    opacity: number;
    transition: {
      duration: number;
      delay?: number;
    };
  };
};

export type ButtonType = {
  url: string;
  pageReference: {
    _ref: string;
  };
  title: string;
};

export type SlugType = {
  current: string;
};

export type SiteSettingsType = {
  referenceTitle: string;
  tagline: string;
  projectTypes: string[];
  projectStyles: string[];
};

export type HomePageType = {
  referenceTitle: string;
  seoTitle: string;
  seoDescription: string;
  featuredProjects: ProjectType[];
};

export type WorkPageType = {
  seoTitle: string;
  seoDescription: string;
};

export type ProjectType = {
  title: string;
  client: string;
  type: string;
  styles: string[];
  year: string;
  credits: {
    role: string;
    title: string;
    link: string;
  }[];
  thumbnailColor: string;
  video: { asset: { playbackId: string } };
  fallbackImage: { asset: { url: string } };
  colorTempFilter: {
    minTemp: number;
    maxTemp: number;
  };
  saturationFilter: number;
  gallery: {
    image: { asset: { url: string } };
    thumbnailColor: string;
    colorTempFilter: {
      minTemp: number;
      maxTemp: number;
    };
    saturationFilter: number;
  }[];
  slug: SlugType;
};

export type GalleryPageType = {
  title: string;
  seoTitle: string;
  seoDescription: string;
};

export type ProjectsPageType = {
  title: string;
  seoTitle: string;
  seoDescription: string;
};

export type InformationPageType = {
  title: string;
  seoTitle: string;
  seoDescription: string;
  ideology: string;
  businessDescription: string;
  email: string;
  instagramHandle: string;
  instagramLink: string;
  aboutText: any[];
  services: string[];
  press: {
    title: string;
    link: string;
  }[];
  news: {
    title: string;
    link: string;
  }[];
  clients: {
    name: string;
    title: string;
    link: string;
  }[];
  featuredClientLogos: {
    asset: {
      url: string;
    };
  }[];
  thankYouTitle: string;
  thankYouMessage: string;
};
