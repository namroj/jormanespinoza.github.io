'use client';
import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';
import normalizeAndCleanString from '@/utils/strings';
import { useExpandCollapseContext } from '@/providers/expand-collapse/ExpandCollapseProvider';
import KeywordSearch from '@/components/ui/keyword/KeywordSearch';
import TagsFilter from '@/components/ui/tag/filter/TagsFilter';
import { LuPackageSearch } from 'react-icons/lu';
import { FormationItem, FormationItemType } from './FormationItem';
import styles from './Formation.module.scss';

export default function Formation({
                                    data,
                                  }: Readonly<{ data: FormationItemType[] }>) {
  const { mainWidth } = useExpandCollapseContext();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearTags = () => setSelectedTags([]);

  const handleClearSearch = () => setSearchTerm('');

  const handleTagClick = (tag: string) =>
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag],
    );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const highlightText = (text: string) => {
    return (
      <Highlighter
        highlightClassName={styles.highlight}
        searchWords={[searchTerm]}
        autoEscape
        textToHighlight={text}
      />
    );
  };

  const filters = (
    <div
      className={`${styles.filters} ${mainWidth < 1280 ? styles['main-reduced'] : ''}`}
    >
      <TagsFilter
        tags={Array.from(new Set(data.flatMap((item) => item.tags)))}
        selectedTags={selectedTags}
        handleTagClick={handleTagClick}
        handleClearTags={handleClearTags}
      />
      <KeywordSearch
        keyword={searchTerm}
        handleSearchChange={handleSearchChange}
        handleClearSearch={handleClearSearch}
      />
    </div>
  );

  const filteredFormation = data.filter((item) => {
    const { entity, tags, ...rest } = item;
    const itemValues = Object.values(rest).filter(
      (value) => typeof value !== 'object',
    );
    const tagsKeywords = tags.join(' ');
    const itemKeywords = normalizeAndCleanString(
      [...itemValues, entity.name, tagsKeywords].join('').toLowerCase(),
    );
    const isTagSelected =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => item.tags.includes(tag));
    const isSearchTermPresent =
      searchTerm === '' ||
      itemKeywords.includes(normalizeAndCleanString(searchTerm));

    return isTagSelected && isSearchTermPresent;
  });

  const formationList =
    filteredFormation.length === 0 ? (
      <div className={styles.empty}>
        <span className={styles.icon}>
          <LuPackageSearch />
        </span>
        <span>
          No se encontraron resultados. Prueba con otra palabra clave.
        </span>
      </div>
    ) : (
      <ul className={styles.items}>
        <div className="content">
          {filteredFormation.map((item: FormationItemType) => (
            <FormationItem
              key={item.title}
              item={item}
              handleTagClick={handleTagClick}
              selectedTags={selectedTags}
              highlightText={highlightText}
            />
          ))}
          <div className="fade-effect" />
        </div>
      </ul>
    );

  return (
    <div
      className={`${styles.formation} ${mainWidth < 1280 && styles['main-reduced']}`}
    >
      {filters}
      <div
        className={`${styles.timeline} ${mainWidth < 1280 && styles['main-reduced']}`}
      >
        <hr />
        {formationList}
      </div>
    </div>
  );
}
