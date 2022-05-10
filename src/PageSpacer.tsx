export const PageSpacer = ({ onClick, showHint }: any) => {
  return (
    <div className="page-spacer" onClick={onClick}>
      {showHint && "Click to create the first paragraph."}
    </div>
  );
};
