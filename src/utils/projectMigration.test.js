import { mergeProjects } from './projectMigration';
test('preserves a custom project while replacing outdated samples', () => {
  const custom = {id:99,title:'Custom',githubUrl:'https://github.com/example/custom'};
  const projects = mergeProjects([custom,{id:2,githubUrl:'https://github.com/mertacar-git/task-manager'}]);
  expect(projects).toContainEqual(custom);
  expect(projects.filter(p=>p.id>=101 && p.id<=107)).toHaveLength(7);
  expect(projects.some(p=>p.githubUrl.endsWith('/task-manager'))).toBe(false);
});
test('handles malformed saved project data', () => {
  expect(mergeProjects('invalid')).toHaveLength(8);
});
