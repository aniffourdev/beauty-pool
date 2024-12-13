import React, { useState, useEffect } from "react";
import api from "@/services/auth";
import Cookies from "js-cookie";
import DOMPurify from 'dompurify';

interface Article {
  id: string;
  title: string;
  content: string; // Add the content field
}

interface SingleBookProps {
  slug: string;
}

const PageContents: React.FC<SingleBookProps> = ({ slug }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect triggered with slug:", slug); // Debugging log
    const getArticle = async () => {
      const accessToken = Cookies.get("access_token"); // Retrieve the access token from cookies
      if (slug && accessToken) {
        try {
          const response = await api.get("/items/footer_menu", {
            params: {
              filter: {
                slug: {
                  _eq: slug,
                },
              },
              fields: "id,title,content", // Ensure you fetch the content field
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const articleData = response.data.data[0];
          console.log("Article Data:", articleData);

          if (articleData) {
            // Adjust the data structure to match the expected format
            const adjustedArticleData: Article = {
              ...articleData,
              reviews: articleData.reviews ? [articleData.reviews] : [],
            };
            setArticle(adjustedArticleData);
          } else {
            setArticle(null);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching article:", error);
          setLoading(false);
        }
      }
    };
    getArticle();
  }, [slug]);

  console.log("Rendering with slug:", slug);

  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="flex justify-center items-center">
          <>Loading...</>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="flex justify-center items-center">
          <>No article found</>
        </div>
      </div>
    );
  }

  const createMarkup = () => {
    return { __html: DOMPurify.sanitize(article.content) };
  };

  return (
    <div className="h-screen w-full bg-white" key={article.id}>
      
      <div className="px-5 lg:px-12 relative top-28">
        <div className=""></div>
        <header className="flex flex-col md:flex-row mt-3 items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{article.title}</h1>
            <div className="mt-4 max-w-5xl font-sans text-sm border border-gray-600 border-opacity-25 p-5 rounded-xl " dangerouslySetInnerHTML={createMarkup()} /> {/* Render the sanitized content */}
          </div>
        </header>
      </div>
    </div>
  );
};

export default PageContents;
