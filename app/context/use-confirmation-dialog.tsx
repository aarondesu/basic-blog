import React, { createContext, useCallback, useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { useIsMobile } from "~/hooks/use-mobile";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
};

type ConfirmationDialogContextProps = {
  createDialog: (props: ConfirmationDialogProps) => void;
};

const ConfirmationDialogContext = createContext<ConfirmationDialogContextProps>(
  {
    createDialog: () => null,
  },
);

export function ConfirmationDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>();
  const isMobile = useIsMobile();
  const [props, setProps] = useState<ConfirmationDialogProps>();

  const createDialog = useCallback(
    (props: ConfirmationDialogProps) => {
      setProps(props);
      setOpen(true);
    },
    [setProps, setOpen],
  );

  const onConfirm = useCallback(async () => {
    // setLoading(true);

    // setLoading(false);
    // setOpen(false);

    setLoading(true);
    await props?.onConfirm();
    setLoading(false);
    setOpen(false);
  }, [props?.onConfirm]);

  return (
    <ConfirmationDialogContext.Provider
      value={{
        createDialog: createDialog,
      }}
    >
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="">
            <DrawerHeader>
              <DrawerTitle>{props?.title}</DrawerTitle>
              <DrawerDescription>{props?.description}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button type="button" disabled={isLoading}>
                Confirm
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{props?.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {props?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isLoading} onClick={onConfirm}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {children}
    </ConfirmationDialogContext.Provider>
  );
}

export function useConfirmationDialog() {
  const context = useContext(ConfirmationDialogContext);

  if (context === undefined) {
    throw new Error(
      "useConfirmationDialog must be used within a ConfirmationDialogProvider",
    );
  }

  return context;
}
