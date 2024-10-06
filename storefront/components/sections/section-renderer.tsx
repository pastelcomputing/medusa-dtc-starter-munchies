import type {
  ArbitraryTypedObject,
  PortableTextBlock,
} from "@portabletext/types";

import {getDeepLinkId} from "@/utils/ids";
import React from "react";

import type {SectionType} from "./types";

import {sectionsList} from ".";

const SectionsRenderer = ({
  fieldName,
  sections,
}: {
  fieldName: string;
  sections?: (ArbitraryTypedObject | PortableTextBlock)[];
}) => {
  if (!sections?.length) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => {
        if (
          !section._type ||
          !(section._type in sectionsList) ||
          !section._key
        ) {
          return null;
        }
        const sectionType = section._type as keyof typeof sectionsList;

        const Component = sectionsList[sectionType];

        if (!Component) {
          return <MissingSection key={section._key} type={section._type} />;
        }

        return (
          <Component
            key={section._key}
            {...section}
            _key={section._key as string}
            _sectionIndex={index}
            _sections={sections}
            _type={section._type as SectionType}
            rootHtmlAttributes={{
              "data-section": sectionType,
              id: getDeepLinkId({blockKey: section._key, fieldName})!,
            }}
          />
        );
      })}
    </>
  );
};

export default SectionsRenderer;

function MissingSection(props: {type?: string}) {
  return (
    <section className="w-full bg-black text-white">
      <div className="container py-10 text-center">
        <div className="rounded-md border-2 border-dashed border-gray-400 px-5 py-10">
          <div>
            The section component of type{" "}
            {props.type && (
              <strong className="px-2 text-xl">{props.type}</strong>
            )}{" "}
            does not exist yet.
          </div>
        </div>
      </div>
    </section>
  );
}
