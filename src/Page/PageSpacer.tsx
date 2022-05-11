export const PageSpacer = ({ handleClick, showHint }: any) => {
  return (
    <div className="page-spacer" onClick={handleClick}>
      {showHint && "Click to create the first paragraph."}
    </div>
  );
};
