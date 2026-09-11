import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { getCaseStudy } from '@/data/case-studies';
import { SITE_URL } from '@/lib/site';

/*
 * changefreq and priority are deliberately absent: Google ignores both, and
 * emitting them just adds noise that implies a signal that isn't read.
 *
 * lastModified now comes from per-project `updatedAt` rather than `new Date()`.
 * Stamping every URL with the build timestamp meant all 28 entries changed
 * every deploy, which tells a crawler nothing except that the numbers can't be
 * trusted — a lastmod that always moves is equivalent to no lastmod.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => {
    const cs = getCaseStudy(project.slug);
    return {
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: cs ? new Date(cs.updatedAt) : undefined,
    };
  });

  // The homepage and the hub aggregate every project, so the most recent
  // project change is the most honest lastmod available for them.
  const newest = projects
    .map((p) => getCaseStudy(p.slug)?.updatedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
  const aggregateLastMod = newest ? new Date(newest) : undefined;

  return [
    { url: SITE_URL, lastModified: aggregateLastMod },
    { url: `${SITE_URL}/projects`, lastModified: aggregateLastMod },
    ...projectEntries,
  ];
}
