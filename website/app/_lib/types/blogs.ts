/**
 * Object type for the "blog" object in the route /wp/v2/blog.
 */
export type BlogType = {
  /** The date the post was published, in the site's timezone. */
  date: string | null;
  /** The date the post was published, as GMT. */
  date_gmt: string | null;
  /** The globally unique identifier for the post. */
  guid: {
    /** GUID for the post, as it exists in the database. */
    raw: string;
    /** GUID for the post, transformed for display. */
    rendered: string;
  };
  /** Unique identifier for the post. */
  id: number;
  /** URL to the post. */
  link: string;
  /** The date the post was last modified, in the site's timezone. */
  modified: string;
  /** The date the post was last modified, as GMT. */
  modified_gmt: string;
  /** An alphanumeric identifier for the post unique to its type. */
  slug: string;
  /** A named status for the post. */
  status: "publish" | "future" | "draft" | "pending" | "private" | "spam";
  /** Type of post. */
  type: string;
  /** A password to protect access to the content and excerpt. */
  password: string;
  /** Permalink template for the post. */
  permalink_template: string;
  /** Slug automatically generated from the post title. */
  generated_slug: string;
  /** An array of the class names for the post container element. */
  class_list: string[];
  /** The title for the post. */
  title: {
    /** Title for the post, as it exists in the database. */
    raw: string;
    /** HTML title for the post, transformed for display. */
    rendered: string;
  };
  /** The content for the post. */
  content: {
    /** Content for the post, as it exists in the database. */
    raw: string;
    /** HTML content for the post, transformed for display. */
    rendered: string;
    /** Version of the content block format used by the post. */
    block_version: number;
    /** Whether the content is protected with a password. */
    protected: boolean;
  };
  /** The ID for the author of the post. */
  author: number;
  /** The ID of the featured media for the post. */
  featured_media: number;
  /** The theme file to use to display the post. */
  template: string;
  /** Are sharing buttons enabled? */
  jetpack_sharing_enabled: boolean;
};

/**
 * Object type for the "blog_category" object in the route /wp/v2/blog_category.
 */
export type BlogCategory = {
  /** Unique identifier for the term. */
  id: number;
  /** Number of published posts for the term. */
  count: number;
  /** HTML description of the term. */
  description: string;
  /** URL of the term. */
  link: string;
  /** HTML title for the term. */
  name: string;
  /** An alphanumeric identifier for the term unique to its type. */
  slug: string;
  /** Type attribution for the term. */
  taxonomy: "blog_category";
  /** The parent term ID. */
  parent: number;
  /** Meta fields. */
  meta: unknown;
};
