import FirecrawlApp from '@mendable/firecrawl-js';

let _firecrawl: any = null;

function getFirecrawl() {
  if (!_firecrawl) {
    _firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
    });
  }
  return _firecrawl;
}

export async function fetchSocialData(queries: string[]) {
  try {
    const firecrawl = getFirecrawl();
    // Run up to 2 top queries to stay fast and avoid rate limits
    const topQueries = queries.slice(0, 2);
    
    const searchPromises = topQueries.map(query => 
      firecrawl.search(query, { limit: 5 })
    );

    const results: any[] = await Promise.all(searchPromises);
    
    const combinedContent: Array<{content: string, title: string}> = [];
    
    for (const result of results) {
      if (result && result.data) {
        result.data.forEach((d: any) => {
          combinedContent.push({
            content: d.markdown || d.description || d.title || "",
            title: d.title || ""
          });
        });
      }
    }
    
    return combinedContent;
  } catch (error) {
    console.error("Firecrawl Error:", error);
    return [];
  }
}
