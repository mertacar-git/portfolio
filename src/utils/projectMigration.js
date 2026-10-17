import { projects } from '../data/projects';

const marker = 'portfolio-aerospace-projects-2026-v9';
const placeholders = new Set(['task-manager','weather-app','blog-platform','ecommerce-api','mobile-ui-kit'].map(name => `https://github.com/mertacar-git/${name}`));

export function mergeProjects(saved) {
  const previous = Array.isArray(saved) ? saved.filter(p => p && !placeholders.has(p.githubUrl)) : [];
  const updates = new Map(projects.map(p => [p.githubUrl, p]));
  const preserved = previous.filter(p => !updates.has(p.githubUrl));
  return [...projects, ...preserved];
}

export function migrateAerospaceProjects() {
  try {
    if (localStorage.getItem(marker)) return;
    const raw = localStorage.getItem('projects');
    let saved = null;
    try { saved = raw ? JSON.parse(raw) : null; } catch { saved = null; }
    if (raw) localStorage.setItem('projects-backup-before-aerospace-2026', raw);
    localStorage.setItem('projects', JSON.stringify(mergeProjects(saved)));
    localStorage.setItem(marker, 'complete');
  } catch (error) {
    console.warn('Project migration could not persist; default projects remain available.', error);
  }
}
