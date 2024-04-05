import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];
        const unsubscribe = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );
      } else {
        console.log("Rejected");
        reject(new Error("User is not authenticated"));
      }

      unsubscribe();
    });
  });
};

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => {
        return doc.data();
      });
      resolve(templates);
      // unsubscribe();
    });
    return unsubscribe;
  });
};
export const getTemplateDetails =  (templateId) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(doc(db, "templates", templateId), (doc) =>( resolve(doc.data()))
    );
    return unsubscribe;
  });
};


export const saveToFavourites = async (data, user) => {
  if (!data?.favourites?.includes(user?.uid)) {
    const docRef = doc(db, "templates", data?._id);

    try {
      await updateDoc(docRef, {
        favourites: arrayUnion(user?.uid),
      });
      toast.success("Added to Favourites");
    } catch (error) {
      toast.error(`Error : ${error.message}`);
    }
  } else {
    const docRef = doc(db, "templates", data?._id);

    try {
      await updateDoc(docRef, {
        favourites: arrayRemove(user?.uid),
      });
      toast.success("Added to Favourites");
    } catch (error) {
      toast.error(`Error : ${error.message}`);
    }
  }
};
export const saveToCollection = async (data, user) => {
  if (!user?.collections?.includes(data?._id)) {
    const docRef = doc(db, "users", user?.uid);

    try {
      await updateDoc(docRef, {
        collections: arrayUnion(data?._id),
      });
      toast.success("Added to Collections");
    } catch (error) {
      toast.error(`Error : ${error.message}`);
    }
  } else {
    const docRef = doc(db, "users", user?.uid);

    try {
      await updateDoc(docRef, {
        collections: arrayRemove(data?._id),
      });
      toast.success("Removed from Collections");
    } catch (error) {
      toast.error(`Error : ${error.message}`);
    }
  }
};


export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        if (doc.exists()) {
          resolve(doc.data());
        } else {
          // reject(new Error("Document does not exist"));
          resolve(null);

        }
      },
      (error) => {
        reject(error); // Reject on error
      }
    );

    return unsubscribe;
  });
};


export const getSavedResumes = (uid) => {
  console.log('Resume for UID:',uid)
  return new Promise((resolve, reject) => {
    const resumeQuery = query(
      collection(db, "users", uid, "resumes"),
   
    );

    const unsubscribe = onSnapshot(resumeQuery, (querySnap) => {
      const resumes = querySnap.docs.map((doc) => {
        // console.log(doc.data())
        return doc.data();
      });
      resolve(resumes);
    });
    return unsubscribe;
  });
};
