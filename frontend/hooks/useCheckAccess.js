import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useGetPatientsOfDoctor from "./useGetPatientsOfDoctor";
import useIsDoctor from "./useIsDoctor";
import useIsPatient from "./useIsPatient";

export default function useCheckAccess(dataOwner) {
  const { address: dataAccessor } = useAccount();
  const { isPatient: ownerIsPatient } = useIsPatient(dataOwner);
  const { isDoctor: accessorIsDoctor } = useIsDoctor(dataAccessor);
  const { patients } = useGetPatientsOfDoctor(accessorIsDoctor);

  const [access, setAccess] = useState(0);

  useEffect(() => {
    if (dataOwner == dataAccessor) setAccess(2);
    else if (ownerIsPatient && accessorIsDoctor && patients.indexOf(dataOwner) != -1) setAccess(1);
  }, [dataOwner, dataAccessor, ownerIsPatient, accessorIsDoctor, patients]);

  return { access };
}
