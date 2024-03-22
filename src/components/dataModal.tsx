import React, { ReactNode } from "react";

const DataModal = ({
  children,
  modalOpen,
  setModalOpen,
}: {
  children: ReactNode;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-slate-300 w-full max-w-lg p-10">{children}</div>
        </div>
      )}
    </>
  );
};

export default DataModal;
