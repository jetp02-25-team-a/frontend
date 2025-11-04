import SearchBar4 from '../_components/client/Searchbar-4';
import Filters from '../_components/client/Filter';
import Section from '../_components/server/Section';

export default function SearchPage() {
  return (
    <>
      <Section>
        <div className="flex gap-10">
          <SearchBar4 />
          <Filters />
        </div>
        <hr className="w-full text-cg" />
      </Section>
      <Section className="bg-lg">
        <div className="w-full flex">
          <div className="grow bg-amber-100">123</div>
          <div className="w-4xl bg-amber-400"></div>
        </div>
      </Section>
    </>
  );
}
