import {
    useAddFavoritePropertyMutation,
    useGetAuthUserQuery,
    useGetPropertiesQuery,
    useGetTenantQuery,
    useRemoveFavoritePropertyMutation,
  } from "@/state/api";
  import { useAppSelector } from "@/state/redux";
  import { Property } from "@/types/prismaTypes";
  import Card from "@/components/Card";
  import React from "react";
  import CardCompact from "@/components/CardCompact";
  

  const Listings = () => {
    const { data: authUser } = useGetAuthUserQuery();
  
    const clerkUserId = authUser?.userInfo?.clerkUserId;
  
    const { data: tenant } = useGetTenantQuery(clerkUserId || "", {
      skip: !clerkUserId,
    });
  
    const [addFavorite] = useAddFavoritePropertyMutation();
    const [removeFavorite] = useRemoveFavoritePropertyMutation();
  
    const viewMode = useAppSelector((state) => state.global.viewMode);
    const filters = useAppSelector((state) => state.global.filters);
  
    const {
      data: properties,
      isLoading,
      isError,
    } = useGetPropertiesQuery(filters);
  
    const handleFavoriteToggle = async (propertyId: number) => {
      if (!authUser || !clerkUserId) return;
  
      const isFavorite = tenant?.favorites?.some(
        (fav: Property) => fav.id === propertyId
      );
  
      if (isFavorite) {
        await removeFavorite({
          clerkUserId,
          propertyId,
        });
      } else {
        await addFavorite({
          clerkUserId,
          propertyId,
        });
      }
    };
  
    if (isLoading) return <>Loading...</>;
    if (isError || !properties) return <div>Failed to fetch properties</div>;
  
    return (
        <div className="w-full">
            <h3 className="text-sm px-4 font-bold">
                {properties.length}{" "}
                <span className="text-gray-700 font-normal">
                    Places in {filters.location}
                </span>
            </h3>
            <div className="flex">
                <div className="p-4 w-full">
                    {properties?.map((property) =>
                        viewMode === "grid" ? (
                            <Card
                                key={property.id}
                                property={property}
                                isFavorite={
                                    tenant?.favorites?.some(
                                        (fav: Property) => fav.id === property.id
                                    ) || false
                                }
                                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                                showFavoriteButton={!!authUser}
                                propertyLink={`/search/${property.id}`}
                            />
                        ) : (
                            <CardCompact
                                key={property.id}
                                property={property}
                                isFavorite={
                                    tenant?.favorites?.some(
                                        (fav: Property) => fav.id === property.id
                                    ) || false
                                }
                                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                                showFavoriteButton={!!authUser}
                                propertyLink={`/search/${property.id}`}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
  
export default Listings;