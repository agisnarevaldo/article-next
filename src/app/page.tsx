"use client";

import React, {useEffect, useState} from "react";

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        const fetchArticles = async () => {
            const res = await fetch("/api");
            const data = await res.json();
            setArticles(data);
        };
        fetchArticles();
    },[]);

    return (
        <div className="bg-gray-500 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="text-2xl mb-4">Articles</h1>
            {articles.map((article: any) => (
                <div key={article.id} className="mb-4">
                    <h2 className="text-xl">{article.title}</h2>
                    <p>{article.content}</p>
                    <img src={article.image} alt={article.title} className="mt-2" />
                </div>
            ))}
        </div>
    );
}

export default function Home() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image) {
            formData.append("image", image);
        }

        const res = await fetch("/api", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            alert("Success!");
            // reset form
            setTitle("");
            setContent("");
            setImage(null);
        } else {
            alert("Failed!");
        }
    }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <form onSubmit={handleSubmit} className="bg-gray-500 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
        </div>

            <div className="mb-6">
                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
            </div>

            <div className="mb-6">
                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                <input
                    type="file"
                    id="image"
                    // value={image?.name || ""}
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="flex items-center justify-between">
                <button type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Submit
                </button>
            </div>
        </form>
        <ArticleList />
    </main>
  );
}
