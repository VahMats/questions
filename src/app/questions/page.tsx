import QuestionsPageClient from "@/components/QuestionPageClient";

interface PageProps {
    searchParams?: Promise<{ limit?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const limit = Number(resolvedParams?.limit ?? "40");

    return <QuestionsPageClient limit={limit} />;
}
