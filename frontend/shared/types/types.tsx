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
  type: {
    name: string;
  }[];
  styles: {
    name: string;
  }[];
  year: string;
  credits: {
    role: string;
    title: string;
    link: string;
  }[];
  thumbnailColor: {
    hex: string;
  };
  video: {
    asset: {
      playbackId: string;
      data: { duration: number };
    };
  };
  fallbackImage: { asset: { url: string; metadata: { lqip: string } } };
  snippetVideo: {
    asset: {
      playbackId: string;
      data: { duration: number };
    };
  };
  snippetFallbackImage: { asset: { url: string; metadata: { lqip: string } } };
  colorTempFilter: {
    minTemp: number;
    maxTemp: number;
  };
  saturationFilter: number;
  gallery: {
    image: { asset: { url: string } };
    thumbnailColor: {
      hex: string;
    };
    colorTempFilter: {
      minTemp: number;
      maxTemp: number;
    };
    saturationFilter: number;
  }[];
  slug: SlugType;
  images?: {
    colorTempFilter?: {
      minTemp: number;
      maxTemp: number;
    };
  }[];
  medianColorTemp?: number;
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
  instagramAccounts: {
    handle: string;
    link: string;
  }[];
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
