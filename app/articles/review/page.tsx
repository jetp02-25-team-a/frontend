import ArticleForm from '../_components/ArticleForms';
import MessageBoard from '../_components/MessageBoard';

export default function WriteArticlePage() {
  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Write Travel Article</h1>
      <ArticleForm />
      <MessageBoard />
    </main>
  );
}
