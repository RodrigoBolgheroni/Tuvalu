const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop();
const inferredBasePath = repositoryName && !repositoryName.endsWith('.github.io') ? '/' + repositoryName : '';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.GITHUB_ACTIONS === 'true' ? inferredBasePath : '');

module.exports = {
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1'],
  output: 'export',
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};
