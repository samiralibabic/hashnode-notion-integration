const hashnodeKey = process.env.HASHNODE_API_KEY;

if (!hashnodeKey) {
    console.error("HASHNODE_API_KEY not found in env!");
    process.exit(1);
  }

export async function gqlHashnodeRequest(query: string) {
    const data = JSON.stringify({ query });

    const response = await fetch("https://gql.hashnode.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${hashnodeKey}`,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();

    return result;
}
