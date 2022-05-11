type PageSpacerProps = {
  handleClick(): void;
  showHint: boolean;
};

export const PageSpacer = ({ handleClick, showHint }: PageSpacerProps) => {
  return (
    <div className="page-spacer" onClick={handleClick}>
      {showHint && "Click to create the first paragraph."}
    </div>
  );
};
