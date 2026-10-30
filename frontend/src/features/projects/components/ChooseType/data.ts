import image1 from 'shared/assets/images/new-personal.png'
import image2 from 'shared/assets/images/new-team.png'
import image3 from 'shared/assets/images/new-organisation.png'
import type { TypeOption } from 'features/projects/types'

export const typeData: TypeOption[] = [
    {
        typeId: 1,
        image: image1,
        title: "Personal Managed",
        description: "You can manage your project or every thing by your self",
        type: "personal"
    },
    {
        typeId: 2,
        image: image2,
        title: "Team Managed",
        description: "You can manage your project or every thing by your self",
        type: "team"
    },
    {
        typeId: 3,
        image: image3,
        title: "Company Managed",
        description: "You can manage your project or every thing by your self",
        type: "company"
    },
]