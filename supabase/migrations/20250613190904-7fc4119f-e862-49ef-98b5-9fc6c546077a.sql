
-- Create function to get staff by service
CREATE OR REPLACE FUNCTION public.get_staff_by_service(service_id integer)
RETURNS TABLE (
    user_id uuid,
    full_name text,
    staff_position text,
    email text,
    phone text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.full_name,
        COALESCE(u.bio, 'Staff') as staff_position,
        u.email,
        u.phone
    FROM public.users u
    WHERE u.role IN ('staff', 'admin')
    AND u.id IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to get available staff by service and date
CREATE OR REPLACE FUNCTION public.get_available_staff_by_service_and_date(
    service_id integer,
    check_date date
)
RETURNS TABLE (
    user_id uuid,
    full_name text,
    staff_position text,
    email text,
    phone text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.full_name,
        COALESCE(u.bio, 'Staff') as staff_position,
        u.email,
        u.phone
    FROM public.users u
    WHERE u.role IN ('staff', 'admin')
    AND u.id IS NOT NULL
    -- For now, return all staff. Later this can be enhanced with availability logic
    AND NOT EXISTS (
        SELECT 1 FROM public.appointments a
        WHERE a.user_id = u.id 
        AND a.appointment_date = check_date
        AND a.status NOT IN ('cancelled', 'no_show')
    );
END;
$$ LANGUAGE plpgsql;

-- Create a view for staff with services (used in About page)
CREATE OR REPLACE VIEW public.staff_with_services_json AS
SELECT 
    json_build_object(
        'user', json_build_object(
            'full_name', u.full_name,
            'bio', u.bio,
            'role', u.role,
            'photo_url', u.avatar_url
        ),
        'positions', json_build_array(
            json_build_object(
                'position', COALESCE(u.bio, 'Staff'),
                'services', '[]'::json
            )
        )
    ) as user,
    json_build_array(
        json_build_object(
            'position', COALESCE(u.bio, 'Staff'),
            'services', '[]'::json
        )
    ) as positions
FROM public.users u
WHERE u.role IN ('staff', 'admin');
