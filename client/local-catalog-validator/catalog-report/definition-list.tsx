import React from "react";

/**
 * Render definition list with given title and values.
 */
export function DefinitionList(props: { title: string, values: string | string[] | null }) {
  if (props.values === null) {
    return null;
  }
  const values = Array.isArray(props.values) ? props.values : [props.values];
  if (values.length === 0) {
    return null;
  }
  return (
    <>
      <dt>{props.title}</dt>
      {values.map(item => <dd key={item}> {item} </dd>)}
    </>
  );
}
