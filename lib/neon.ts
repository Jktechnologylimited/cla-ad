// Minimal Neon API client — creates an isolated database (project) per tenant.
// Requires NEON_API_KEY (account-level key from Neon account settings).
const NEON_API = "https://console.neon.tech/api/v2";

export interface NeonProject {
  connectionUri: string;  // full postgres connection string for the new DB
  projectId: string;
}

export async function createNeonProject(name: string): Promise<NeonProject> {
  const key = process.env.NEON_API_KEY;
  if (!key) throw new Error("NEON_API_KEY is not set");

  const project: Record<string, unknown> = { name: name.slice(0, 60) };
  if (process.env.NEON_REGION) project.region_id = process.env.NEON_REGION;

  const res = await fetch(`${NEON_API}/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ project }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Neon project creation failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const connectionUri: string | undefined = data?.connection_uris?.[0]?.connection_uri;
  const projectId: string | undefined = data?.project?.id;
  if (!connectionUri || !projectId) {
    throw new Error("Neon did not return a connection string / project id");
  }
  return { connectionUri, projectId };
}
