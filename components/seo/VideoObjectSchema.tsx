import Head from "next/head";

interface VideoObjectSchemaProps {
    title: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration?: string; // ISO 8601 format (e.g., PT1M33S)
    contentUrl?: string;
    embedUrl?: string;
}

export default function VideoObjectSchema({
    title,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl,
    embedUrl,
}: VideoObjectSchemaProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title,
        description: description,
        thumbnailUrl: thumbnailUrl,
        uploadDate: uploadDate,
        duration: duration,
        contentUrl: contentUrl,
        embedUrl: embedUrl,
    };

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </Head>
    );
}
